import { useNavigate } from "react-router-dom";
import { FileText, Shield, ScrollText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const policies = [
  {
    icon: FileText,
    title: "Terms of Service",
    description: "Rules and guidelines for using the platform",
    content: "By using this platform, you agree to abide by our terms and conditions. Users must be at least 18 years old. All activities must comply with applicable laws. Credits earned through fraudulent activities will be forfeited and accounts may be permanently suspended.",
  },
  {
    icon: Shield,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your data",
    content: "We collect minimal personal information necessary to operate our services. Your email and activity data are stored securely. We never sell your personal data to third parties. You can request data deletion at any time by contacting support.",
  },
  {
    icon: ScrollText,
    title: "Refund Policy",
    description: "Credit purchases and refund conditions",
    content: "Credit purchases are non-refundable once processed. Unused credits remain in your account indefinitely. Withdrawal requests are processed within 3-5 business days. A commission fee applies to all withdrawals as stated on the withdrawal page.",
  },
  {
    icon: FileText,
    title: "Community Guidelines",
    description: "Standards for fair and respectful engagement",
    content: "Users must complete tasks honestly and authentically. Fake engagements, bot usage, or manipulation of any kind is strictly prohibited. Violations will result in account suspension and forfeiture of credits. Report violations to help maintain platform integrity.",
  },
];

const PoliciesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="gradient-primary px-5 pb-6 pt-12 rounded-b-3xl">
        <div>
          <h1 className="text-lg font-bold text-primary-foreground">Policies</h1>
        </div>
      </div>

      <div className="px-5 mt-4 space-y-3">
        {policies.map((policy) => (
          <Card key={policy.title} className="border-border">
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <policy.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{policy.title}</h3>
                  <p className="text-[11px] text-muted-foreground">{policy.description}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{policy.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PoliciesPage;
