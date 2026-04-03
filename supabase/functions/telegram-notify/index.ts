const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/telegram";

interface NotifyPayload {
  event_type: string;
  record: Record<string, unknown>;
}

function formatNewUser(r: Record<string, unknown>): string {
  return `🆕 <b>New User Signed Up!</b>
━━━━━━━━━━━━━━
<b>Name:</b> ${r.name || "N/A"}
<b>Email:</b> ${r.email || "N/A"}
<b>Referral Code:</b> ${r.referral_code || "N/A"}
<b>Referred By:</b> ${r.referred_by || "None"}
<b>Time:</b> ${new Date(r.created_at as string).toUTCString()}`;
}

function formatNewCampaign(r: Record<string, unknown>): string {
  return `🎯 <b>New Campaign Created!</b>
━━━━━━━━━━━━━━
<b>Title:</b> ${r.title}
<b>Platform:</b> ${r.platform}
<b>Action:</b> ${r.action}
<b>Budget:</b> ${r.total_budget} credits
<b>Reward/Action:</b> ${r.reward_per_action} credits
<b>Link:</b> ${r.link}
<b>Time:</b> ${new Date(r.created_at as string).toUTCString()}`;
}

function formatCreditPurchase(r: Record<string, unknown>): string {
  return `💰 <b>New Credit Purchase!</b>
━━━━━━━━━━━━━━
<b>Amount:</b> ${r.amount} credits
<b>Method:</b> ${r.method || "N/A"}
<b>Ref:</b> ${r.transaction_ref || "N/A"}
<b>Status:</b> ${r.status}
<b>Time:</b> ${new Date(r.created_at as string).toUTCString()}`;
}

function formatWithdrawal(r: Record<string, unknown>): string {
  return `💸 <b>New Withdrawal Request!</b>
━━━━━━━━━━━━━━
<b>Amount:</b> ${r.amount} credits
<b>Method:</b> ${r.method}
<b>Commission:</b> ${r.commission}
<b>Net Amount:</b> ${r.net_amount}
<b>Status:</b> ${r.status}
<b>Time:</b> ${new Date(r.requested_at as string).toUTCString()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const TELEGRAM_API_KEY = Deno.env.get("TELEGRAM_API_KEY");
    if (!TELEGRAM_API_KEY) throw new Error("TELEGRAM_API_KEY is not configured");

    const CHAT_ID = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID");
    if (!CHAT_ID) throw new Error("TELEGRAM_ADMIN_CHAT_ID is not configured");

    const { event_type, record } = (await req.json()) as NotifyPayload;

    let text: string;
    switch (event_type) {
      case "new_user":
        text = formatNewUser(record);
        break;
      case "new_campaign":
        text = formatNewCampaign(record);
        break;
      case "credit_purchase":
        text = formatCreditPurchase(record);
        break;
      case "withdrawal":
        text = formatWithdrawal(record);
        break;
      case "telegram_login":
        text = `📱 <b>New Telegram Login!</b>\n━━━━━━━━━━━━━━\n<b>Name:</b> ${record.name || "N/A"}\n<b>Username:</b> @${record.username || "N/A"}\n<b>Telegram ID:</b> ${record.telegram_id || "N/A"}\n<b>Time:</b> ${new Date().toUTCString()}`;
        break;
      default:
        text = `📢 <b>Event: ${event_type}</b>\n${JSON.stringify(record, null, 2)}`;
    }

    const response = await fetch(`${GATEWAY_URL}/sendMessage`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TELEGRAM_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: "HTML",
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Telegram API failed [${response.status}]: ${JSON.stringify(data)}`);
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("telegram-notify error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
