import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Clock, ExternalLink, Search, Building2 } from "lucide-react";

type Hospital = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  specialties: string[];
  emergency: boolean;
  hours: string;
  rating: number;
};

const hospitals: Hospital[] = [
  { id: 1, name: "City General Hospital", address: "123 Main St", city: "New York", phone: "(212) 555-0100", specialties: ["Emergency", "Cardiology", "Neurology"], emergency: true, hours: "24/7", rating: 4.5 },
  { id: 2, name: "Green Valley Medical Center", address: "456 Oak Ave", city: "Los Angeles", phone: "(310) 555-0200", specialties: ["Pediatrics", "Orthopedics", "Dermatology"], emergency: true, hours: "24/7", rating: 4.2 },
  { id: 3, name: "Sunrise Community Clinic", address: "789 Pine Rd", city: "Chicago", phone: "(312) 555-0300", specialties: ["General Practice", "Vaccination", "Women's Health"], emergency: false, hours: "8AM - 8PM", rating: 4.7 },
  { id: 4, name: "Metro Heart Institute", address: "321 Elm Blvd", city: "Houston", phone: "(713) 555-0400", specialties: ["Cardiology", "Cardiac Surgery", "Vascular"], emergency: true, hours: "24/7", rating: 4.8 },
  { id: 5, name: "Lakeside Family Practice", address: "654 Lake Dr", city: "Phoenix", phone: "(602) 555-0500", specialties: ["General Practice", "Pediatrics", "Vaccination"], emergency: false, hours: "9AM - 6PM", rating: 4.3 },
  { id: 6, name: "Downtown Urgent Care", address: "987 Market St", city: "San Francisco", phone: "(415) 555-0600", specialties: ["Urgent Care", "X-Ray", "Lab Tests"], emergency: false, hours: "7AM - 10PM", rating: 4.1 },
  { id: 7, name: "St. Mary's Teaching Hospital", address: "111 University Pkwy", city: "Boston", phone: "(617) 555-0700", specialties: ["Oncology", "Neurology", "Research"], emergency: true, hours: "24/7", rating: 4.9 },
  { id: 8, name: "Pacific Wellness Center", address: "222 Beach Rd", city: "Seattle", phone: "(206) 555-0800", specialties: ["Mental Health", "Physical Therapy", "Nutrition"], emergency: false, hours: "8AM - 7PM", rating: 4.4 },
];

const allSpecialties = [...new Set(hospitals.flatMap((h) => h.specialties))].sort();

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("all");
  const [emergencyOnly, setEmergencyOnly] = useState(false);

  const filtered = useMemo(() => {
    return hospitals.filter((h) => {
      const matchSearch = !search || h.name.toLowerCase().includes(search.toLowerCase()) || h.city.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = specialty === "all" || h.specialties.includes(specialty);
      const matchEmergency = !emergencyOnly || h.emergency;
      return matchSearch && matchSpecialty && matchEmergency;
    });
  }, [search, specialty, emergencyOnly]);

  return (
    <div className="container py-8 pb-20 md:pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Hospital & Clinic Finder</h1>
        <p className="text-sm text-muted-foreground">Find healthcare facilities near you</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {allSpecialties.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={emergencyOnly ? "default" : "outline"}
          onClick={() => setEmergencyOnly(!emergencyOnly)}
          className={emergencyOnly ? "health-gradient border-0" : ""}
        >
          🚑 Emergency
        </Button>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{filtered.length} facilities found</p>

      {/* Results */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((hospital) => (
          <Card key={hospital.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-health-blue-light shrink-0">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{hospital.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" /> {hospital.address}, {hospital.city}
                    </div>
                  </div>
                </div>
                {hospital.emergency && (
                  <Badge className="bg-health-red text-primary-foreground text-[10px] shrink-0">ER</Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {hospital.specialties.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{hospital.phone}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{hospital.hours}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">⭐ {hospital.rating}</span>
                </div>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + " " + hospital.city)}`, "_blank")}
                >
                  <ExternalLink className="h-3 w-3 mr-1" /> Directions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No facilities match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
