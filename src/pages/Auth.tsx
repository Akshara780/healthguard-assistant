import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { Phone, ArrowRight, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Auth() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/vaccinations");
  }, [user, navigate]);

  const formatPhone = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.startsWith("91")) return `+${digits}`;
    if (digits.startsWith("0")) return `+91${digits.slice(1)}`;
    return `+91${digits}`;
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = formatPhone(phone);
    if (formatted.length < 12) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({ phone: formatted });
      if (error) throw error;
      toast.success("OTP sent to your phone!");
      setStep("otp");
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formatPhone(phone),
        token: otp,
        type: "sms",
      });
      if (error) throw error;
      toast.success("Signed in successfully!");
      navigate("/vaccinations");
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-12 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            {step === "phone" ? (
              <Phone className="h-7 w-7 text-primary" />
            ) : (
              <ShieldCheck className="h-7 w-7 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === "phone" ? "Welcome to HealthGuard" : "Enter OTP"}
          </CardTitle>
          <CardDescription>
            {step === "phone"
              ? "Enter your phone number to get started"
              : `We sent a 6-digit code to ${formatPhone(phone)}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "phone" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <Label>Phone Number</Label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    +91
                  </span>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="98765 43210"
                    className="pl-12"
                    maxLength={15}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full health-gradient border-0" disabled={loading}>
                {loading ? "Sending OTP..." : "Get OTP"}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full health-gradient border-0" disabled={loading}>
                {loading ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <button
                type="button"
                onClick={() => { setStep("phone"); setOtp(""); }}
                className="w-full text-center text-sm text-muted-foreground underline"
              >
                Change phone number
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
