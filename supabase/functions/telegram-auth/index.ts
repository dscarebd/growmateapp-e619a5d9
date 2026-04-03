import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

async function hmacSHA256(key: Uint8Array, data: string): Promise<Uint8Array> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(sig);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function validateTelegramData(initData: string, botToken: string): Promise<Record<string, string> | null> {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return null;

  params.delete("hash");
  const entries = Array.from(params.entries());
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  const dataCheckString = entries.map(([k, v]) => `${k}=${v}`).join("\n");

  const secretKey = await hmacSHA256(new TextEncoder().encode("WebAppData"), botToken);
  const computedHash = bytesToHex(await hmacSHA256(secretKey, dataCheckString));

  if (computedHash !== hash) return null;

  // Check auth_date is not too old (allow 1 hour)
  const authDate = parseInt(params.get("auth_date") || "0");
  if (Date.now() / 1000 - authDate > 3600) return null;

  const result: Record<string, string> = {};
  for (const [k, v] of entries) {
    result[k] = v;
  }
  result["hash"] = hash;
  return result;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    if (!BOT_TOKEN) throw new Error("TELEGRAM_BOT_TOKEN not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { initData } = await req.json();
    if (!initData) {
      return new Response(JSON.stringify({ error: "initData required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validated = await validateTelegramData(initData, BOT_TOKEN);
    if (!validated) {
      return new Response(JSON.stringify({ error: "Invalid Telegram data" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userDataStr = validated["user"];
    if (!userDataStr) {
      return new Response(JSON.stringify({ error: "No user data in initData" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const tgUser = JSON.parse(userDataStr);
    const telegramId = tgUser.id;
    const firstName = tgUser.first_name || "";
    const lastName = tgUser.last_name || "";
    const username = tgUser.username || "";
    const photoUrl = tgUser.photo_url || "";
    const fullName = `${firstName} ${lastName}`.trim() || username || `User ${telegramId}`;

    // Check if profile with this telegram_id exists
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, email")
      .eq("telegram_id", telegramId)
      .maybeSingle();

    let userId: string;
    let isNewUser = false;

    if (existingProfile) {
      userId = existingProfile.id;

      // Update profile with latest Telegram info
      await supabaseAdmin.from("profiles").update({
        telegram_username: username,
        avatar_url: photoUrl || undefined,
        name: fullName,
      }).eq("id", userId);
    } else {
      isNewUser = true;
      const email = `tg_${telegramId}@telegram.growmate.app`;
      const password = crypto.randomUUID();

      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: fullName,
          telegram_id: telegramId,
        },
      });

      if (authError) throw authError;
      userId = authData.user.id;

      // Update profile with telegram fields (profile auto-created by trigger)
      await supabaseAdmin.from("profiles").update({
        telegram_id: telegramId,
        telegram_username: username,
        avatar_url: photoUrl || undefined,
      }).eq("id", userId);
    }

    // Generate session tokens
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: existingProfile?.email || `tg_${telegramId}@telegram.growmate.app`,
    });

    // Use signInWithPassword approach instead - create a known password approach
    // Actually, use admin to get user and create a session via custom token
    // Best approach: use admin.generateLink won't give us tokens directly
    // Let's use the workaround: sign in with email/password using the service role

    // Better approach: use supabase admin to create a session
    const email = existingProfile?.email || `tg_${telegramId}@telegram.growmate.app`;

    // Set a known temporary password and sign in
    const tempPassword = `tg_session_${crypto.randomUUID()}`;
    await supabaseAdmin.auth.admin.updateUser(userId, { password: tempPassword });

    // Create a regular client to sign in
    const supabaseClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password: tempPassword,
    });

    if (signInError) throw signInError;

    // Send admin notification for new users
    if (isNewUser) {
      try {
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
        const CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");

        if (LOVABLE_API_KEY && TELEGRAM_API_KEY && CHAT_ID) {
          const text = `🆕 <b>New Telegram User!</b>
━━━━━━━━━━━━━━
<b>Name:</b> ${fullName}
<b>Username:</b> @${username || "N/A"}
<b>Telegram ID:</b> ${telegramId}
<b>Time:</b> ${new Date().toUTCString()}`;

          await fetch(`${GATEWAY_URL}/sendMessage`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": TELEGRAM_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
          });
        }
      } catch (e) {
        console.error("Failed to send admin notification:", e);
      }
    }

    return new Response(JSON.stringify({
      access_token: signInData.session!.access_token,
      refresh_token: signInData.session!.refresh_token,
      user: {
        id: userId,
        name: fullName,
        username,
        telegram_id: telegramId,
      },
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("telegram-auth error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
