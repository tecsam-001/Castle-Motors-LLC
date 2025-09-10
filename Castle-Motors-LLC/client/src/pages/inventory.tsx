import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import type { Vehicle } from "@shared/schema";
import VehicleCard from "@/components/VehicleCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Inventory() {
  const [, setLocation] = useLocation();
  const { data: vehicles, isLoading, refetch, error } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });



  const handleViewDetails = (vehicle: Vehicle) => {
    setLocation(`/vehicle/${vehicle.id}`);
  };

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-inventory-title">
            Premium Inventory
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-inventory-subtitle">
            Hand-selected vehicles that meet our rigorous quality standards. Each car comes with detailed history and our guarantee.
          </p>
        </div>


        {/* Vehicle Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse" data-testid={`skeleton-vehicle-${i}`}>
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded mb-4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card className="text-center py-12 col-span-full" data-testid="card-error">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Error Loading Vehicles</h3>
              <p className="text-muted-foreground mb-4">
                There was an error loading our inventory. Please try again.
              </p>
              <Button onClick={() => refetch()} className="bg-primary text-primary-foreground">
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(vehicles) && vehicles.length > 0 ? (
              vehicles
                .filter((vehicle: Vehicle) => vehicle.status === "available")
                .map((vehicle: Vehicle) => (
                  <VehicleCard 
                    key={vehicle.id} 
                    vehicle={vehicle} 
                    onUpdate={refetch}
                    onViewDetails={handleViewDetails}
                  />
                ))
            ) : (
              <Card className="text-center py-12 col-span-full" data-testid="card-no-vehicles">
                <CardContent>
                  <div className="text-muted-foreground mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" data-testid="text-no-vehicles-title">No Vehicles Available</h3>
                  <p className="text-muted-foreground" data-testid="text-no-vehicles-subtitle">
                    We're currently updating our inventory. Please check back soon for our latest selection of premium vehicles.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
