import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, ExternalLink, Search, Building2, Loader2, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Hospital = {
  id: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  specialties: string[];
  emergency: boolean;
  hours: string;
  lat?: number;
  lon?: number;
  distance?: number;
  website?: string;
  type?: string;
};

export default function Hospitals() {
  const [search, setSearch] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const { toast } = useToast();

  const searchHospitals = useCallback(async (query?: string) => {
    const searchQuery = query ?? search;
    if (!searchQuery.trim()) {
      toast({ title: "Please enter a city or location to search", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data, error } = await supabase.functions.invoke("search-hospitals", {
        body: { query: searchQuery.trim() },
      });

      if (error) throw error;

      setHospitals(data?.hospitals || []);

      if ((data?.hospitals || []).length === 0) {
        toast({ title: "No hospitals found", description: "Try a different location or broader search term." });
      }
    } catch (err) {
      console.error("Search error:", err);
      toast({ title: "Search failed", description: "Please try again later.", variant: "destructive" });
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [search, toast]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") searchHospitals();
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", variant: "destructive" });
      return;
    }

    setLoading(true);
    setSearched(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { data, error } = await supabase.functions.invoke("search-hospitals", {
            body: { lat: position.coords.latitude, lon: position.coords.longitude },
          });
          if (error) throw error;
          setHospitals(data?.hospitals || []);
        } catch (err) {
          console.error("Location search error:", err);
          toast({ title: "Search failed", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      },
      () => {
        toast({ title: "Location access denied", description: "Please enter a city name instead.", variant: "destructive" });
        setLoading(false);
      }
    );
  };

  const filtered = emergencyOnly ? hospitals.filter((h) => h.emergency) : hospitals;

  return (
    <div className="container py-8 pb-20 md:pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Hospital & Clinic Finder</h1>
        <p className="text-sm text-muted-foreground">Search any city worldwide to find nearby healthcare facilities</p>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Enter city name (e.g. Trichy, London, New York)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button onClick={() => searchHospitals()} disabled={loading} className="health-gradient border-0">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Search className="h-4 w-4 mr-1" />}
          Search
        </Button>
        <Button variant="outline" onClick={useMyLocation} disabled={loading}>
          <MapPin className="h-4 w-4 mr-1" /> Near Me
        </Button>
      </div>

      {/* Filters */}
      {hospitals.length > 0 && (
        <div className="flex gap-3 mb-4">
          <Button
            variant={emergencyOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={emergencyOnly ? "health-gradient border-0" : ""}
          >
            🚑 Emergency Only
          </Button>
          <p className="text-sm text-muted-foreground self-center">{filtered.length} facilities found</p>
        </div>
      )}

      {/* Initial state */}
      {!searched && (
        <div className="text-center py-16 text-muted-foreground">
          <Globe className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-1">Search for hospitals worldwide</p>
          <p className="text-sm">Enter any city name or use your current location</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <Loader2 className="h-10 w-10 mx-auto mb-3 animate-spin text-primary" />
          <p className="text-muted-foreground">Searching for hospitals...</p>
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
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
                        <MapPin className="h-3 w-3 shrink-0" /> {hospital.address}
                      </div>
                      {hospital.distance && (
                        <p className="text-xs text-muted-foreground mt-0.5">{hospital.distance} km away</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 items-end shrink-0">
                    {hospital.emergency && (
                      <Badge className="bg-health-red text-primary-foreground text-[10px]">ER</Badge>
                    )}
                    {hospital.type && (
                      <Badge variant="outline" className="text-[10px]">{hospital.type}</Badge>
                    )}
                  </div>
                </div>

                {hospital.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {hospital.specialties.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
                  {hospital.phone && (
                    <a href={`tel:${hospital.phone}`} className="flex items-center gap-1 hover:text-primary">
                      <Phone className="h-3 w-3" />{hospital.phone}
                    </a>
                  )}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{hospital.hours}</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1" />
                  {hospital.website && (
                    <Button variant="ghost" size="sm" onClick={() => window.open(hospital.website, "_blank")}>
                      <Globe className="h-3 w-3 mr-1" /> Website
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const q = hospital.lat && hospital.lon
                        ? `${hospital.lat},${hospital.lon}`
                        : encodeURIComponent(hospital.name + " " + hospital.city);
                      window.open(`https://www.google.com/maps/search/${q}`, "_blank");
                    }}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" /> Directions
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && searched && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No facilities found. Try a different location.</p>
        </div>
      )}
    </div>
  );
}
