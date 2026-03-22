import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Syringe, Calendar, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import WhatsAppSubscribe from "@/components/WhatsAppSubscribe";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";

type VaccineRecord = {
  id: string;
  name: string;
  date: string;
  provider: string;
  dose: string;
};

const vaccineTypes = [
  "COVID-19", "Influenza (Flu)", "Hepatitis A", "Hepatitis B",
  "MMR (Measles, Mumps, Rubella)", "Tetanus/Diphtheria (Td)",
  "Polio (IPV)", "Varicella (Chickenpox)", "HPV", "Pneumococcal",
  "Meningococcal", "Shingles (Zoster)", "Other",
];

const recommendedSchedule = [
  { vaccine: "Influenza (Flu)", frequency: "Annually", ageGroup: "All ages (6+ months)" },
  { vaccine: "COVID-19", frequency: "As recommended", ageGroup: "All ages (6+ months)" },
  { vaccine: "Tetanus/Diphtheria (Td)", frequency: "Every 10 years", ageGroup: "Adults" },
  { vaccine: "Shingles (Zoster)", frequency: "Two doses", ageGroup: "Adults 50+" },
  { vaccine: "Pneumococcal", frequency: "One-time series", ageGroup: "Adults 65+" },
  { vaccine: "HPV", frequency: "2-3 dose series", ageGroup: "Ages 9-26" },
];

const STORAGE_KEY = "healthguard-vaccinations";

export default function Vaccinations() {
  const [records, setRecords] = useState<VaccineRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch { return []; }
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: "", date: "", provider: "", dose: "1st dose" });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }, [records]);

  const addRecord = () => {
    if (!form.name || !form.date) {
      toast.error("Please fill in vaccine name and date.");
      return;
    }
    const record: VaccineRecord = { id: crypto.randomUUID(), ...form };
    setRecords((prev) => [record, ...prev]);
    setForm({ name: "", date: "", provider: "", dose: "1st dose" });
    setDialogOpen(false);
    toast.success("Vaccination record added!");
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
    toast.info("Record removed.");
  };

  return (
    <div className="container py-8 pb-20 md:pb-10 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Vaccination Tracker</h1>
          <p className="text-sm text-muted-foreground">Track your immunization history</p>
        </div>
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
      </div>

      {/* Records */}
      <div className="space-y-3 mb-8">
        {records.length === 0 ? (
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
                  <h3 className="font-medium text-sm">{record.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(record.date).toLocaleDateString()}</span>
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

      {/* Recommended Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recommended Vaccination Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendedSchedule.map((item) => (
              <div key={item.vaccine} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.vaccine}</p>
                  <p className="text-xs text-muted-foreground">{item.ageGroup}</p>
                </div>
                <Badge variant="outline" className="text-xs">{item.frequency}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
