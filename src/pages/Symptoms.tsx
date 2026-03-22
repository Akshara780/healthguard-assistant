import { useState } from "react";
import { Button } from "@/components/ui/button";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, ArrowRight, ArrowLeft, Activity, Brain, Heart, Bone, Eye, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const bodyAreas = [
  { id: "head", label: "Head & Brain", icon: Brain },
  { id: "chest", label: "Chest & Heart", icon: Heart },
  { id: "stomach", label: "Stomach & Digestive", icon: Activity },
  { id: "bones", label: "Bones & Joints", icon: Bone },
  { id: "eyes", label: "Eyes & Vision", icon: Eye },
  { id: "general", label: "General / Other", icon: Stethoscope },
];

const symptomsByArea: Record<string, string[]> = {
  head: ["Headache", "Dizziness", "Blurred vision", "Nausea", "Confusion", "Fever", "Neck stiffness"],
  chest: ["Chest pain", "Shortness of breath", "Palpitations", "Coughing", "Wheezing", "Chest tightness"],
  stomach: ["Abdominal pain", "Nausea", "Vomiting", "Diarrhea", "Bloating", "Loss of appetite", "Heartburn"],
  bones: ["Joint pain", "Swelling", "Stiffness", "Back pain", "Muscle weakness", "Difficulty walking"],
  eyes: ["Eye pain", "Redness", "Blurred vision", "Sensitivity to light", "Watery eyes", "Dry eyes"],
  general: ["Fatigue", "Fever", "Weight loss", "Night sweats", "Chills", "Skin rash", "Swollen lymph nodes"],
};

const severityLevels = [
  { id: "mild", label: "Mild", description: "Noticeable but not disruptive", color: "bg-health-green-light text-health-green" },
  { id: "moderate", label: "Moderate", description: "Somewhat disruptive to daily activities", color: "bg-health-orange-light text-health-orange" },
  { id: "severe", label: "Severe", description: "Significantly impacts daily life", color: "bg-health-red-light text-health-red" },
];

type Result = {
  condition: string;
  likelihood: string;
  urgency: "low" | "medium" | "high";
  description: string;
  recommendation: string;
};

function getResults(area: string, symptoms: string[], severity: string): Result[] {
  // Mock results based on input
  const results: Result[] = [];
  if (area === "head" && symptoms.includes("Headache")) {
    results.push({
      condition: "Tension Headache",
      likelihood: "High",
      urgency: severity === "severe" ? "medium" : "low",
      description: "Common type of headache often caused by stress, fatigue, or muscle tension.",
      recommendation: "Rest, hydration, and over-the-counter pain relief. If persistent, consult a doctor.",
    });
  }
  if (area === "chest" && symptoms.includes("Chest pain")) {
    results.push({
      condition: "Possible Cardiac Concern",
      likelihood: "Moderate",
      urgency: "high",
      description: "Chest pain can have many causes. Cardiac causes need immediate evaluation.",
      recommendation: "Seek immediate medical attention. Call emergency services if pain is severe or accompanied by shortness of breath.",
    });
  }
  if (symptoms.includes("Fever")) {
    results.push({
      condition: "Possible Infection",
      likelihood: "Moderate",
      urgency: severity === "severe" ? "high" : "medium",
      description: "Fever is often a sign of infection. The body raises its temperature to fight pathogens.",
      recommendation: "Monitor temperature, stay hydrated, and rest. See a doctor if fever exceeds 103°F (39.4°C) or persists beyond 3 days.",
    });
  }
  if (results.length === 0) {
    results.push({
      condition: "General Health Concern",
      likelihood: "Varies",
      urgency: severity === "severe" ? "medium" : "low",
      description: "Your symptoms may indicate various conditions that require professional evaluation.",
      recommendation: "Schedule an appointment with your healthcare provider for a proper diagnosis.",
    });
  }
  return results;
}

export default function Symptoms() {
  const [step, setStep] = useState(0);
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severity, setSeverity] = useState("");
  const [results, setResults] = useState<Result[] | null>(null);

  const handleAnalyze = () => {
    const r = getResults(selectedArea, selectedSymptoms, severity);
    setResults(r);
    setStep(3);
    if (r.some((x) => x.urgency === "high")) {
      toast.warning("Some results indicate high urgency. Please seek medical attention.");
    }
  };

  const reset = () => {
    setStep(0);
    setSelectedArea("");
    setSelectedSymptoms([]);
    setSeverity("");
    setResults(null);
  };

  return (
    <div className="container py-8 pb-20 md:pb-10 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Symptom Checker</h1>
        <p className="text-sm text-muted-foreground">Select your symptoms for AI-powered health guidance</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {["Body Area", "Symptoms", "Severity", "Results"].map((label, i) => (
          <div key={label} className="flex-1">
            <div className={cn("h-1.5 rounded-full transition-colors", i <= step ? "health-gradient" : "bg-muted")} />
            <p className={cn("text-[10px] mt-1 font-medium", i <= step ? "text-primary" : "text-muted-foreground")}>{label}</p>
          </div>
        ))}
      </div>

      {/* Step 0: Body Area */}
      {step === 0 && (
        <div className="grid grid-cols-2 gap-3">
          {bodyAreas.map((area) => (
            <Card
              key={area.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedArea === area.id && "ring-2 ring-primary"
              )}
              onClick={() => { setSelectedArea(area.id); setStep(1); setSelectedSymptoms([]); }}
            >
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className="p-3 rounded-xl bg-health-blue-light">
                  <area.icon className="h-6 w-6 text-primary" />
                </div>
                <span className="text-sm font-medium">{area.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Step 1: Symptoms */}
      {step === 1 && (
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select your symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {symptomsByArea[selectedArea]?.map((symptom) => (
                <label key={symptom} className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={selectedSymptoms.includes(symptom)}
                    onCheckedChange={(checked) => {
                      setSelectedSymptoms((prev) =>
                        checked ? [...prev, symptom] : prev.filter((s) => s !== symptom)
                      );
                    }}
                  />
                  <span className="text-sm">{symptom}</span>
                </label>
              ))}
            </CardContent>
          </Card>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(0)}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
            <Button onClick={() => setStep(2)} disabled={selectedSymptoms.length === 0} className="health-gradient border-0 flex-1">
              Continue <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Severity */}
      {step === 2 && (
        <div>
          <div className="space-y-3">
            {severityLevels.map((level) => (
              <Card
                key={level.id}
                className={cn("cursor-pointer transition-all", severity === level.id && "ring-2 ring-primary")}
                onClick={() => setSeverity(level.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("px-3 py-1 rounded-full text-xs font-semibold", level.color)}>{level.label}</div>
                  <span className="text-sm text-muted-foreground">{level.description}</span>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="mr-1 h-4 w-4" />Back</Button>
            <Button onClick={handleAnalyze} disabled={!severity} className="health-gradient border-0 flex-1">
              Analyze Symptoms <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && results && (
        <div className="space-y-4">
          {results.map((result, i) => (
            <Card key={i} className={cn(
              "border-l-4",
              result.urgency === "high" ? "border-l-health-red" : result.urgency === "medium" ? "border-l-health-orange" : "border-l-health-green"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{result.condition}</h3>
                  <Badge variant={result.urgency === "high" ? "destructive" : "secondary"} className="text-xs">
                    {result.urgency === "high" ? "🔴 High Urgency" : result.urgency === "medium" ? "🟡 Medium" : "🟢 Low"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{result.description}</p>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm font-medium">💡 Recommendation</p>
                  <p className="text-sm text-muted-foreground">{result.recommendation}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-health-orange-light/50 border-health-orange/20">
            <CardContent className="p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-health-orange shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This is an AI-generated assessment and should not replace professional medical advice. 
                Please consult a healthcare provider for accurate diagnosis and treatment.
              </p>
            </CardContent>
          </Card>

          <Button onClick={reset} variant="outline" className="w-full">Check Another Symptom</Button>
        </div>
      )}
    </div>
  );
}
