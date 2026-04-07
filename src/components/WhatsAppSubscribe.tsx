import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageCircle, CheckCircle, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export default function WhatsAppSubscribe({ className }: { className?: string }) {
  const [phone, setPhone] = useState("");
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [vaccineReminders, setVaccineReminders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<{
    phone: string;
    health_alerts: boolean;
    vaccine_reminders: boolean;
  } | null>(null);

  // Check localStorage for existing phone to look up DB subscription
  useEffect(() => {
    const saved = localStorage.getItem("healthguard-whatsapp-phone");
    if (saved) {
      loadSubscription(saved);
    }
  }, []);

  const loadSubscription = async (phoneNum: string) => {
    const { data } = await supabase
      .from("whatsapp_subscriptions")
      .select("phone, health_alerts, vaccine_reminders, active")
      .eq("phone", phoneNum)
      .eq("active", true)
      .maybeSingle();
    if (data) {
      setSubscription(data);
    }
  };

  const handleSubscribe = async () => {
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error("Please enter a valid phone number with country code (e.g., +1234567890)");
      return;
    }
    if (!healthAlerts && !vaccineReminders) {
      toast.error("Please select at least one notification type.");
      return;
    }

    setIsLoading(true);
    try {
      // Upsert subscription in DB
      const { error } = await supabase
        .from("whatsapp_subscriptions")
        .upsert(
          {
            phone: phone.trim(),
            health_alerts: healthAlerts,
            vaccine_reminders: vaccineReminders,
            active: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "phone" }
        );

      if (error) throw error;

      // Send welcome message via Twilio
      const { error: fnError } = await supabase.functions.invoke("send-whatsapp", {
        body: {
          to: phone.trim(),
          message: `🏥 Welcome to HealthGuard!\n\nYou're now subscribed to:\n${healthAlerts ? "✅ Health alerts & outbreak notifications\n" : ""}${vaccineReminders ? "✅ Vaccination reminders\n" : ""}\nReply STOP to unsubscribe anytime.`,
        },
      });

      if (fnError) {
        console.warn("Welcome message failed:", fnError);
        // Don't block subscription if welcome message fails
      }

      localStorage.setItem("healthguard-whatsapp-phone", phone.trim());
      setSubscription({ phone: phone.trim(), health_alerts: healthAlerts, vaccine_reminders: vaccineReminders });
      setIsEditing(false);
      toast.success("WhatsApp notifications activated! Check your WhatsApp for a welcome message.");
    } catch (err) {
      console.error("Subscribe error:", err);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsLoading(true);
    try {
      if (subscription) {
        await supabase
          .from("whatsapp_subscriptions")
          .update({ active: false, updated_at: new Date().toISOString() })
          .eq("phone", subscription.phone);
      }
      localStorage.removeItem("healthguard-whatsapp-phone");
      setSubscription(null);
      setPhone("");
      setHealthAlerts(true);
      setVaccineReminders(true);
      toast.info("WhatsApp notifications disabled.");
    } finally {
      setIsLoading(false);
    }
  };

  if (subscription && !isEditing) {
    return (
      <Card className={cn("border-[#25D366]/20 bg-[#25D366]/5", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#25D366]/10 shrink-0">
              <CheckCircle className="h-5 w-5 text-[#25D366]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">WhatsApp notifications active</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {subscription.phone} · {[subscription.health_alerts && "Alerts", subscription.vaccine_reminders && "Reminders"].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => { setPhone(subscription.phone); setHealthAlerts(subscription.health_alerts); setVaccineReminders(subscription.vaccine_reminders); setIsEditing(true); }}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleUnsubscribe} disabled={isLoading}>
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border-[#25D366]/20", className)}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#25D366]/10">
            <MessageCircle className="h-5 w-5 text-[#25D366]" />
          </div>
          <div>
            <p className="text-sm font-semibold">WhatsApp Notifications</p>
            <p className="text-xs text-muted-foreground">Get health alerts & vaccine reminders on WhatsApp</p>
          </div>
        </div>

        <div>
          <Label className="text-xs">Phone number (with country code)</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            type="tel"
            className="mt-1"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={healthAlerts} onCheckedChange={(c) => setHealthAlerts(!!c)} />
            <span className="text-sm">Health alerts & outbreak notifications</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={vaccineReminders} onCheckedChange={(c) => setVaccineReminders(!!c)} />
            <span className="text-sm">Vaccination reminders</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubscribe} disabled={isLoading} className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <MessageCircle className="h-4 w-4 mr-1" />}
            Subscribe
          </Button>
          {isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
          )}
        </div>

        <p className="text-[10px] text-muted-foreground">
          By subscribing, you agree to receive health-related notifications via WhatsApp. You can unsubscribe anytime.
        </p>
      </CardContent>
    </Card>
  );
}
