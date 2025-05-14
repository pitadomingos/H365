import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Phone, Navigation } from "lucide-react";
import Image from "next/image";

export default function PharmacyLocatorPage() {
  const pharmacies = [
    { id: 1, name: "HealthFirst Pharmacy", address: "123 Wellness Ave, HealthCity", phone: "(555) 111-2222", distance: "0.5 miles", hours: "9 AM - 9 PM" },
    { id: 2, name: "MediQuick Drugs", address: "456 Cure Blvd, MedTown", phone: "(555) 333-4444", distance: "1.2 miles", hours: "8 AM - 10 PM (24/7 Drive-thru)" },
    { id: 3, name: "Community Care Pharmacy", address: "789 Remedy Ln, Careville", phone: "(555) 555-6666", distance: "2.5 miles", hours: "9 AM - 7 PM" },
    { id: 4, name: "The Pill Stop", address: "101 Prescription Rd, PharmaVille", phone: "(555) 777-8888", distance: "3.1 miles", hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-1PM" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-8 w-8" /> Pharmacy Locator
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Find a Pharmacy Near You</CardTitle>
            <CardDescription>Enter your location or zip code to find nearby pharmacies.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 mb-6">
              <Input type="text" placeholder="Enter address, city, or zip code..." className="flex-grow" />
              <Button>
                <Search className="mr-2 h-4 w-4" /> Search
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Pharmacy List */}
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {pharmacies.map((pharmacy) => (
                  <Card key={pharmacy.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{pharmacy.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 pt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" /> {pharmacy.address}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" /> {pharmacy.phone}
                      </p>
                       <p><span className="font-medium">Hours:</span> {pharmacy.hours}</p>
                      <p><span className="font-medium">Distance:</span> {pharmacy.distance}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Navigation className="mr-2 h-4 w-4" /> Directions
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="rounded-lg border overflow-hidden shadow-sm">
                <Image 
                  src="https://placehold.co/600x400.png" // Placeholder for map
                  alt="Map placeholder"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint="map location"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
