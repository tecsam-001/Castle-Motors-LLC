import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@shared/schema";

interface VehicleCardProps {
  vehicle: Vehicle;
  onUpdate?: () => void;
  onViewDetails?: (vehicle: Vehicle) => void;
}

export default function VehicleCard({ vehicle, onUpdate, onViewDetails }: VehicleCardProps) {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const getMainImage = () => {
    if (vehicle.images && vehicle.images.length > 0) {
      return vehicle.images[0];
    }
    // Fallback image based on vehicle make
    const makeImages: Record<string, string> = {
      bmw: "https://images.unsplash.com/photo-1555215695-3004980ad54e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      toyota: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      honda: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    };
    return makeImages[vehicle.make.toLowerCase()] || "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600";
  };

  return (
    <Card className="overflow-hidden border border-border shadow-lg hover:shadow-xl transition-shadow" data-testid={`card-vehicle-${vehicle.id}`}>
      <img
        src={getMainImage()}
        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        className="w-full h-48 object-cover bg-gray-100"
        data-testid={`img-vehicle-${vehicle.id}`}
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-foreground" data-testid={`text-vehicle-title-${vehicle.id}`}>
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h3>
          <Badge className="bg-secondary text-secondary-foreground" data-testid={`text-vehicle-price-${vehicle.id}`}>
            {formatPrice(vehicle.price)}
          </Badge>
        </div>
        
        <div className="text-muted-foreground space-y-1 mb-4">
          <p data-testid={`text-vehicle-details-${vehicle.id}`}>
            {vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : 'Mileage not specified'} 
            {vehicle.transmission && ` • ${vehicle.transmission}`}
            {vehicle.drivetrain && ` • ${vehicle.drivetrain}`}
          </p>
          {vehicle.features && vehicle.features.trim() && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">Features:</p>
              <div className="flex flex-wrap gap-1">
                {vehicle.features.split(", ").slice(0, 3).map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {feature.trim()}
                  </Badge>
                ))}
                {vehicle.features.split(", ").length > 3 && (
                  <Badge variant="outline" className="text-xs px-1 py-0 bg-muted">
                    +{vehicle.features.split(", ").length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
        
        <Button 
          onClick={() => onViewDetails?.(vehicle)}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          data-testid={`button-view-details-${vehicle.id}`}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
