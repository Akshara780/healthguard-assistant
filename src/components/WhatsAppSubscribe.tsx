import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MessageCircle, CheckCircle, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "healthguard-whatsapp-prefs";

type WhatsAppPrefs = {
  phone: string;
  healthAlerts: boolean;
  vaccineReminders: boolean;
  subscribedAt: string;
};

export default function WhatsAppSubscribe({ className }: { className?: string }) {
  const [prefs, setPrefs] = useState<WhatsAppPrefs | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [phone, setPhone] = useState("");
  const [healthAlerts, setHealthAlerts] = useState(true);
  const [vaccineReminders, setVaccineReminders] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubscribe = () => {
    if (!phone.trim() || phone.trim().length < 10) {
      toast.error("Please enter a valid phone number with country code (e.g., +1234567890)");
      return;
    }
    if (!healthAlerts && !vaccineReminders) {
      toast.error("Please select at least one notification type.");
      return;
    }
    const newPrefs: WhatsAppPrefs = {
      phone: phone.trim(),
      healthAlerts,
      vaccineReminders,
      subscribedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPrefs));
    setPrefs(newPrefs);
    setIsEditing(false);
    toast.success("WhatsApp notifications preferences saved! You'll receive updates when the service is fully activated.");
  };

  const handleUnsubscribe = () => {
    localStorage.removeItem(STORAGE_KEY);
    setPrefs(null);
    setPhone("");
    setHealthAlerts(true);
    setVaccineReminders(true);
    toast.info("WhatsApp notifications disabled.");
  };

  if (prefs && !isEditing) {
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
                {prefs.phone} · {[prefs.healthAlerts && "Alerts", prefs.vaccineReminders && "Reminders"].filter(Boolean).join(", ")}
              </p>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => { setPhone(prefs.phone); setHealthAlerts(prefs.healthAlerts); setVaccineReminders(prefs.vaccineReminders); setIsEditing(true); }}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={handleUnsubscribe}>
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
          <Button onClick={handleSubscribe} className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white border-0">
            <MessageCircle className="h-4 w-4 mr-1" /> Subscribe
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
