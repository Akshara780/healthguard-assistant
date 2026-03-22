import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Info, Bell, Shield, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import WhatsAppSubscribe from "@/components/WhatsAppSubscribe";

type Alert = {
  id: number;
  title: string;
  description: string;
  severity: "critical" | "warning" | "info";
  region: string;
  date: string;
  actions: string[];
};

const alerts: Alert[] = [
  {
    id: 1, title: "Flu Season Advisory", severity: "warning", region: "National",
    date: "2026-03-05",
    description: "Influenza activity is increasing across the country. The CDC recommends annual flu vaccination for everyone 6 months and older.",
    actions: ["Get your annual flu shot", "Practice good hand hygiene", "Stay home if you feel unwell"],
  },
  {
    id: 2, title: "COVID-19 Booster Available", severity: "info", region: "National",
    date: "2026-03-01",
    description: "Updated COVID-19 boosters are now available for all eligible individuals. Check with your healthcare provider.",
    actions: ["Schedule your booster", "Check eligibility at vaccines.gov"],
  },
  {
    id: 3, title: "Measles Outbreak Alert", severity: "critical", region: "Northeast",
    date: "2026-02-28",
    description: "A measles outbreak has been reported in several counties. Ensure your MMR vaccination is up to date.",
    actions: ["Verify your MMR vaccination status", "Avoid contact with infected individuals", "Report symptoms to your doctor"],
  },
  {
    id: 4, title: "Heat Wave Health Warning", severity: "warning", region: "Southwest",
    date: "2026-02-25",
    description: "Extreme heat expected in the coming week. Stay hydrated and avoid prolonged outdoor activity during peak hours.",
    actions: ["Drink plenty of water", "Stay in air-conditioned spaces", "Check on elderly neighbors"],
  },
  {
    id: 5, title: "Free Health Screening Event", severity: "info", region: "Midwest",
    date: "2026-02-20",
    description: "Free blood pressure, cholesterol, and diabetes screenings available at community centers this weekend.",
    actions: ["Find your nearest screening location", "Bring your insurance card (optional)"],
  },
  {
    id: 6, title: "Norovirus Advisory", severity: "warning", region: "Southeast",
    date: "2026-02-15",
    description: "Increased norovirus activity reported. Practice thorough handwashing and food safety precautions.",
    actions: ["Wash hands frequently with soap", "Disinfect surfaces", "Avoid preparing food while ill"],
  },
];

const severityConfig = {
  critical: { icon: AlertTriangle, color: "bg-health-red-light text-health-red", badge: "bg-health-red text-primary-foreground" },
  warning: { icon: Bell, color: "bg-health-orange-light text-health-orange", badge: "bg-health-orange text-primary-foreground" },
  info: { icon: Info, color: "bg-health-blue-light text-health-blue", badge: "bg-primary text-primary-foreground" },
};

const regions = ["All Regions", "National", "Northeast", "Southeast", "Midwest", "Southwest"];

export default function Alerts() {
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filtered = alerts.filter((a) => {
    const matchRegion = regionFilter === "All Regions" || a.region === regionFilter;
    const matchSeverity = severityFilter === "all" || a.severity === severityFilter;
    return matchRegion && matchSeverity;
  });

  return (
    <div className="container py-8 pb-20 md:pb-10 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Health Alerts</h1>
        <p className="text-sm text-muted-foreground">Public health advisories and updates</p>
      </div>

      <div className="flex gap-3 mb-6">
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            {regions.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filtered.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <Card key={alert.id} className={cn("border-l-4", 
              alert.severity === "critical" ? "border-l-health-red" : 
              alert.severity === "warning" ? "border-l-health-orange" : "border-l-primary"
            )}>
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", config.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold">{alert.title}</h3>
                      <Badge className={cn("text-[10px]", config.badge)}>{alert.severity}</Badge>
                      <Badge variant="outline" className="text-[10px]">{alert.region}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{new Date(alert.date).toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-xs font-semibold mb-1.5 flex items-center gap-1"><Shield className="h-3 w-3" /> Recommended Actions</p>
                      <ul className="space-y-1">
                        {alert.actions.map((action, i) => (
                          <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                            <span className="text-primary mt-0.5">•</span> {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-1.5 text-[#25D366] hover:text-[#25D366] p-0 h-auto text-xs"
                      onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`⚠️ Health Alert: ${alert.title}\n\n${alert.description}\n\nRecommended actions:\n${alert.actions.map(a => `• ${a}`).join('\n')}\n\n— Shared from HealthGuard`)}`, "_blank", "noopener,noreferrer")}
                    >
                      <MessageCircle className="h-3 w-3" /> Share via WhatsApp
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No alerts match your filters.</p>
        </div>
      )}
    </div>
  );
}
