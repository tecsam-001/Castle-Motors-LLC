import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Phone, Mail, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { Vehicle, InsertVehicleInquiry } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVehicleInquirySchema } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function VehicleDetails() {
  const { id } = useParams() as { id: string };
  const [, setLocation] = useLocation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vehicle details
  const { data: vehicle, isLoading } = useQuery<Vehicle>({
    queryKey: ["/api/vehicles", id],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/vehicles/${id}`);
      return await response.json();
    },
  });

  // Vehicle inquiry form
  const form = useForm<InsertVehicleInquiry>({
    resolver: zodResolver(insertVehicleInquirySchema),
    defaultValues: {
      vehicleId: id,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // Submit inquiry mutation
  const inquiryMutation = useMutation({
    mutationFn: async (data: InsertVehicleInquiry) => {
      return await apiRequest("POST", "/api/vehicle-inquiries", data);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Sent",
        description: "Your inquiry has been sent successfully. We'll contact you soon!",
      });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send inquiry",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertVehicleInquiry) => {
    inquiryMutation.mutate(data);
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(parseFloat(price));
  };

  const nextImage = () => {
    if (vehicle?.images && vehicle.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === vehicle.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (vehicle?.images && vehicle.images.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? vehicle.images.length - 1 : prev - 1
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading vehicle details...</div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
          <Button onClick={() => setLocation("/")}>Return to Inventory</Button>
        </div>
      </div>
    );
  }

  const hasImages = vehicle.images && vehicle.images.length > 0;
  const currentImage = hasImages ? vehicle.images[currentImageIndex] : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="/castle-motors-logo.png" 
                alt="Castle Motors"
                className="h-10 w-auto"
              />
              <Button 
                variant="ghost" 
                onClick={() => setLocation("/")}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Inventory
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="aspect-video relative bg-gray-100">
                {currentImage ? (
                  <img 
                    src={currentImage}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}
                
                {/* Navigation arrows for multiple images */}
                {hasImages && vehicle.images.length > 1 && (
                  <>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
                
                {/* Image counter */}
                {hasImages && vehicle.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                    {currentImageIndex + 1} / {vehicle.images.length}
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail strip for multiple images */}
            {hasImages && vehicle.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                      index === currentImageIndex ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img 
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Vehicle Details & Contact Form */}
          <div className="space-y-6">
            {/* Vehicle Information */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </CardTitle>
                    <div className="text-3xl font-bold text-primary mt-2">
                      {formatPrice(vehicle.price)}
                    </div>
                  </div>
                  <Badge className={
                    vehicle.status === 'available' ? 'bg-green-500' :
                    vehicle.status === 'sold' ? 'bg-red-500' : 'bg-yellow-500'
                  }>
                    {vehicle.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Mileage:</strong>
                    <p>{vehicle.mileage?.toLocaleString() || 'Not specified'} miles</p>
                  </div>
                  <div>
                    <strong>Transmission:</strong>
                    <p>{vehicle.transmission || 'Not specified'}</p>
                  </div>
                  <div>
                    <strong>Drivetrain:</strong>
                    <p>{vehicle.drivetrain || 'Not specified'}</p>
                  </div>
                  <div className="col-span-2">
                    <strong>Features:</strong>
                    {vehicle.features && vehicle.features.trim() ? (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {vehicle.features.split(", ").map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature.trim()}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-1">None specified</p>
                    )}
                  </div>
                </div>
                
                {vehicle.description && (
                  <div>
                    <strong>Description:</strong>
                    <p className="text-muted-foreground mt-1">{vehicle.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Interested in this vehicle?
                </CardTitle>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you with more information.
                </p>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Tell us what you'd like to know about this vehicle..."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={inquiryMutation.isPending}
                      data-testid="button-submit-inquiry"
                    >
                      {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Direct Contact */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h3 className="font-semibold">Or contact us directly:</h3>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Sales and Service: (678) 744-2145</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>Broker: (404) 220-9234</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>castlemotorsatl@gmail.com</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    2759 Delk Rd Ste 1190, Marietta, GA 30067
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}