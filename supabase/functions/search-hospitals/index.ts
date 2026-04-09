import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, lat, lon } = await req.json();

    let searchLat = lat;
    let searchLon = lon;

    // If no coordinates provided, geocode the query
    if (!searchLat || !searchLon) {
      if (!query) {
        return new Response(
          JSON.stringify({ error: "Please provide a search query or coordinates" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
      const geocodeRes = await fetch(geocodeUrl, {
        headers: { "User-Agent": "HealthGuardApp/1.0" },
      });
      const geocodeData = await geocodeRes.json();

      if (!geocodeData || geocodeData.length === 0) {
        return new Response(
          JSON.stringify({ error: "Location not found", hospitals: [] }),
          { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      searchLat = parseFloat(geocodeData[0].lat);
      searchLon = parseFloat(geocodeData[0].lon);
    }

    // Query Overpass API for hospitals and clinics within 15km radius
    const overpassQuery = `[out:json][timeout:15];(node["amenity"="hospital"](around:15000,${searchLat},${searchLon});way["amenity"="hospital"](around:15000,${searchLat},${searchLon});node["amenity"="clinic"](around:15000,${searchLat},${searchLon});way["amenity"="clinic"](around:15000,${searchLat},${searchLon}););out center body 40;`;

    const overpassRes = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(overpassQuery)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "HealthGuardApp/1.0",
      },
    });

    const overpassData = await overpassRes.json();

    const hospitals = (overpassData.elements || [])
      .filter((el: any) => el.tags?.name)
      .map((el: any, index: number) => {
        const elLat = el.lat || el.center?.lat;
        const elLon = el.lon || el.center?.lon;
        const tags = el.tags || {};

        // Calculate distance
        const distance = elLat && elLon
          ? haversine(searchLat, searchLon, elLat, elLon)
          : null;

        return {
          id: el.id || index,
          name: tags.name || "Unknown",
          address: [tags["addr:street"], tags["addr:housenumber"], tags["addr:city"], tags["addr:postcode"]]
            .filter(Boolean)
            .join(", ") || "Address not available",
          city: tags["addr:city"] || query || "",
          phone: tags.phone || tags["contact:phone"] || "",
          specialties: getSpecialties(tags),
          emergency: tags.emergency === "yes" || tags.amenity === "hospital",
          hours: tags.opening_hours || (tags.amenity === "hospital" ? "24/7" : "Contact for hours"),
          lat: elLat,
          lon: elLon,
          distance: distance ? Math.round(distance * 10) / 10 : null,
          website: tags.website || tags["contact:website"] || "",
          type: tags.amenity === "hospital" ? "Hospital" : tags.amenity === "clinic" ? "Clinic" : "Doctor",
        };
      })
      .sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));

    return new Response(
      JSON.stringify({
        hospitals,
        location: { lat: searchLat, lon: searchLon },
        count: hospitals.length,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error searching hospitals:", error);
    return new Response(
      JSON.stringify({ error: "Failed to search hospitals", hospitals: [] }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getSpecialties(tags: Record<string, string>): string[] {
  const specialties: string[] = [];
  if (tags.amenity === "hospital") specialties.push("Hospital");
  if (tags.amenity === "clinic") specialties.push("Clinic");
  if (tags.amenity === "doctors") specialties.push("General Practice");
  if (tags.emergency === "yes") specialties.push("Emergency");
  if (tags["healthcare:speciality"]) {
    specialties.push(...tags["healthcare:speciality"].split(";").map((s: string) => s.trim()));
  }
  if (tags.healthcare) {
    specialties.push(tags.healthcare);
  }
  return [...new Set(specialties)].slice(0, 4);
}
