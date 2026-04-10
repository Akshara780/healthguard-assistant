import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Syringe, Calendar, Trash2, CheckCircle, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import WhatsAppSubscribe from "@/components/WhatsAppSubscribe";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";

type VaccineRecord = {
  id: string;
  vaccine_name: string;
  date_taken: string;
  provider: string | null;
  dose: string;
  notes: string | null;
};

type VaccineSchedule = {
  id: string;
  vaccine_name: string;
  frequency: string;
  age_group: string;
  description: string | null;
};

const vaccineTypes = [
  "COVID-19", "Influenza (Flu)", "Hepatitis A", "Hepatitis B",
  "MMR (Measles, Mumps, Rubella)", "Tetanus/Diphtheria (Td)",
  "Polio (IPV)", "Varicella (Chickenpox)", "HPV", "Pneumococcal",
  "Meningococcal", "Shingles (Zoster)", "Other",
];

export default function Vaccinations() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [records, setRecords] = useState<VaccineRecord[]>([]);
  const [schedules, setSchedules] = useState<VaccineSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", provider: "", dose: "1st dose" });

  // Fetch recommended schedules (public)
  useEffect(() => {
    const fetchSchedules = async () => {
      const { data } = await supabase.from("vaccination_schedules").select("*");
      if (data) setSchedules(data);
    };
    fetchSchedules();
  }, []);

  // Fetch user records
  useEffect(() => {
    if (!user) {
      setRecords([]);
      setLoading(false);
      return;
    }
    const fetchRecords = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("vaccination_records")
        .select("*")
        .order("date_taken", { ascending: false });
      if (error) {
        console.error("Error fetching records:", error);
      } else {
        setRecords(data || []);
      }
      setLoading(false);
    };
    fetchRecords();
  }, [user]);

  const addRecord = async () => {
    if (!form.name || !form.date) {
      toast.error("Please fill in vaccine name and date.");
      return;
    }
    if (!user) {
      toast.error("Please sign in to add records.");
      return;
    }

    const { data, error } = await supabase
      .from("vaccination_records")
      .insert({
        user_id: user.id,
        vaccine_name: form.name,
        date_taken: form.date,
        provider: form.provider || null,
        dose: form.dose,
      })
      .select()
      .single();

    if (error) {
      toast.error("Failed to save record.");
      console.error(error);
      return;
    }

    setRecords((prev) => [data, ...prev]);
    setForm({ name: "", date: "", provider: "", dose: "1st dose" });
    setDialogOpen(false);
    toast.success("Vaccination record added!");
  };

  const deleteRecord = async (id: string) => {
    const { error } = await supabase.from("vaccination_records").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete record.");
      return;
    }
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.info("Record removed.");
  };

  if (authLoading) {
    return (
      <div className="container py-16 text-center">
        <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-8 pb-20 md:pb-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Vaccination Tracker</h1>
          <p className="text-sm text-muted-foreground">Track your immunization history</p>
        </div>
        {user ? (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="health-gradient border-0">
                <Plus className="h-4 w-4 mr-1" /> Add Vaccine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Vaccination Record</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div>
                  <Label>Vaccine</Label>
                  <Select value={form.name} onValueChange={(v) => setForm((f) => ({ ...f, name: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select vaccine" /></SelectTrigger>
                    <SelectContent>
                      {vaccineTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
                </div>
                <div>
                  <Label>Provider / Location</Label>
                  <Input value={form.provider} onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))} placeholder="e.g., City Clinic" />
                </div>
                <div>
                  <Label>Dose</Label>
                  <Select value={form.dose} onValueChange={(v) => setForm((f) => ({ ...f, dose: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["1st dose", "2nd dose", "3rd dose", "Booster", "Annual"].map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addRecord} className="w-full health-gradient border-0">Save Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <Button className="health-gradient border-0" onClick={() => navigate("/auth")}>
            <LogIn className="h-4 w-4 mr-1" /> Sign In to Track
          </Button>
        )}
      </div>

      {/* Sign-in prompt */}
      {!user && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <Syringe className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-3">Sign in to track your vaccination records across devices</p>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              <LogIn className="h-4 w-4 mr-1" /> Sign In
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Records */}
      {user && (
        <div className="space-y-3 mb-8">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 mx-auto animate-spin text-primary" />
            </div>
          ) : records.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Syringe className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No vaccination records yet. Add your first one!</p>
              </CardContent>
            </Card>
          ) : (
            records.map((record) => (
              <Card key={record.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-health-green-light shrink-0">
                    <CheckCircle className="h-5 w-5 text-health-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{record.vaccine_name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(record.date_taken).toLocaleDateString()}</span>
                      {record.provider && <span>• {record.provider}</span>}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0">{record.dose}</Badge>
                  <Button variant="ghost" size="sm" onClick={() => deleteRecord(record.id)}>
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Share vaccination records */}
      {user && records.length > 0 && (
        <div className="mb-4">
          <WhatsAppShareButton
            text={`My Vaccination Records:\n\n${records.map((r) => `✅ ${r.vaccine_name} — ${new Date(r.date_taken).toLocaleDateString()} (${r.dose})${r.provider ? ` at ${r.provider}` : ""}`).join("\n")}\n\n— Shared from HealthGuard`}
            label="Share records via WhatsApp"
            variant="outline"
            className="w-full"
          />
        </div>
      )}

      {/* Recommended Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Vaccination Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {schedules.length === 0 ? (
              <div className="text-center py-4">
                <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
              </div>
            ) : (
              schedules.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.vaccine_name}</p>
                    <p className="text-xs text-muted-foreground">{item.age_group}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{item.frequency}</Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Reminders */}
      <div className="mt-6">
        <WhatsAppSubscribe />
      </div>
    </div>
  );
}
