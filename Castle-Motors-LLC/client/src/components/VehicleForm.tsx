import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { insertVehicleSchema, type InsertVehicle, type Vehicle } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ObjectUploader } from "@/components/ObjectUploader";
import type { UploadResult } from "@uppy/core";

interface VehicleFormProps {
  onSuccess: () => void;
  vehicle?: Vehicle;
  mode?: 'create' | 'edit';
}

const carMakes = [
  "Acura", "Audi", "BMW", "Cadillac", "Chevrolet", "Chrysler", "Dodge",
  "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia", "Lexus",
  "Mazda", "Mercedes-Benz", "Nissan", "Subaru", "Toyota", "Volkswagen", "Volvo"
];

const transmissionTypes = ["Manual", "Automatic", "CVT"];
const drivetrainTypes = ["FWD", "RWD", "AWD", "4WD"];

const vehicleFeatures = [
  // Comfort & Convenience
  "Air Conditioning", "Climate Control", "Heated Seats", "Cooled Seats", "Leather Seats",
  "Power Seats", "Memory Seats", "Lumbar Support", "Sunroof", "Moonroof", "Panoramic Roof",
  "Remote Start", "Keyless Entry", "Push Button Start", "Cruise Control", "Adaptive Cruise Control",
  "Automatic Headlights", "LED Headlights", "HID Headlights", "Fog Lights", "Tinted Windows",
  
  // Technology & Entertainment
  "Navigation System", "GPS", "Backup Camera", "360-Degree Camera", "Parking Sensors",
  "Bluetooth", "Apple CarPlay", "Android Auto", "USB Ports", "Wireless Charging",
  "Premium Sound System", "Subwoofer", "CD Player", "Satellite Radio", "AM/FM Radio",
  "Touchscreen Display", "Digital Instrument Cluster", "Head-Up Display",
  
  // Safety & Security
  "Airbags", "Side Airbags", "Curtain Airbags", "Anti-lock Brakes (ABS)", "Electronic Stability Control",
  "Traction Control", "Blind Spot Monitoring", "Lane Departure Warning", "Lane Keep Assist",
  "Forward Collision Warning", "Automatic Emergency Braking", "Adaptive Headlights",
  "Security System", "Alarm System", "Anti-theft System", "Immobilizer",
  
  // Performance & Handling
  "Turbo", "Supercharger", "Sport Mode", "Eco Mode", "Manual Transmission", "Automatic Transmission",
  "CVT", "Paddle Shifters", "Limited Slip Differential", "Sport Suspension", "Air Suspension",
  "All-Wheel Drive", "Four-Wheel Drive", "Front-Wheel Drive", "Rear-Wheel Drive",
  
  // Exterior Features
  "Alloy Wheels", "Chrome Wheels", "Run-flat Tires", "Spare Tire", "Roof Rack", "Tow Hitch",
  "Power Windows", "Power Mirrors", "Heated Mirrors", "Side Steps", "Running Boards",
  "Bed Liner", "Tonneau Cover", "Convertible Top", "Hardtop", "Soft Top",
  
  // Interior Features
  "Third Row Seating", "Split-Folding Rear Seats", "Rear Entertainment System", "Rear Climate Control",
  "Cup Holders", "Storage Compartments", "Cargo Net", "Cargo Cover", "Floor Mats",
  "Wood Trim", "Carbon Fiber Trim", "Aluminum Trim", "Ambient Lighting",
  
  // Fuel & Efficiency
  "Hybrid", "Plug-in Hybrid", "Electric", "Fuel Efficient", "Eco-Friendly", "Low Emissions",
  
  // Warranty & Maintenance
  "Extended Warranty", "Certified Pre-Owned", "One Owner", "Clean Title", "Accident Free",
  "Service Records", "Non-Smoker", "Garage Kept"
];

export default function VehicleForm({ onSuccess, vehicle, mode = 'create' }: VehicleFormProps) {
  const { toast } = useToast();
  const [currentVehicleId, setCurrentVehicleId] = useState<string | null>(vehicle?.id || null);
  const [uploadedImages, setUploadedImages] = useState<string[]>(vehicle?.images || []);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    vehicle?.features ? vehicle.features.split(", ").filter(f => f.trim()) : []
  );

  // Update selected features when vehicle prop changes (for edit mode)
  useEffect(() => {
    if (vehicle?.features) {
      setSelectedFeatures(vehicle.features.split(", ").filter(f => f.trim()));
    } else {
      setSelectedFeatures([]);
    }
  }, [vehicle?.features]);

  const form = useForm<InsertVehicle>({
    resolver: zodResolver(insertVehicleSchema),
    defaultValues: {
      make: vehicle?.make || "",
      model: vehicle?.model || "",
      year: vehicle?.year || new Date().getFullYear(),
      price: vehicle?.price || "0",
      mileage: vehicle?.mileage || 0,
      transmission: vehicle?.transmission || "",
      drivetrain: vehicle?.drivetrain || "",
      features: vehicle?.features || "",
      description: vehicle?.description || "",
      images: vehicle?.images || [],
      status: vehicle?.status || "available",
    },
  });

  const saveVehicleMutation = useMutation({
    mutationFn: async (data: InsertVehicle) => {
      const method = mode === 'edit' ? 'PUT' : 'POST';
      const url = mode === 'edit' ? `/api/vehicles/${vehicle?.id}` : '/api/vehicles';
      const response = await apiRequest(method, url, data);
      return response.json();
    },
    onSuccess: (savedVehicle) => {
      setCurrentVehicleId(savedVehicle.id);
      toast({
        title: "Success",
        description: mode === 'edit' ? "Vehicle updated successfully!" : "Vehicle added successfully!",
      });
      // Call parent success handler to refresh list and close form
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: InsertVehicle) => {
    // Include uploaded images and selected features in the data
    const vehicleData = {
      ...data,
      images: uploadedImages,
      features: selectedFeatures.join(", ")
    };
    saveVehicleMutation.mutate(vehicleData);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setSelectedFeatures(prev => {
      if (checked) {
        return [...prev, feature];
      } else {
        return prev.filter(f => f !== feature);
      }
    });
  };

  const handleGetUploadParameters = async () => {
    const response = await apiRequest("POST", "/api/objects/upload", {});
    const result = await response.json();
    return {
      method: "PUT" as const,
      url: result.uploadURL,
    };
  };

  const handleUploadComplete = async (result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
    const newImages: string[] = [];
    
    for (const file of result.successful || []) {
      if (file.uploadURL) {
        try {
          // Process the upload URL to get the proper object path
          const response = await apiRequest("PUT", "/api/vehicle-images", {
            imageURL: file.uploadURL,
          });
          const data = await response.json();
          // Use the normalized object path that can be served via /objects/ route
          newImages.push(data.objectPath);
        } catch (error) {
          console.error("Error processing image:", error);
          // Extract object path from the Google Cloud Storage URL
          const url = new URL(file.uploadURL);
          const pathParts = url.pathname.split('/');
          // Find the uploads part and get the file ID
          const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
          if (uploadsIndex >= 0 && uploadsIndex < pathParts.length - 1) {
            const fileId = pathParts[uploadsIndex + 1];
            const normalizedPath = `/objects/uploads/${fileId}`;
            newImages.push(normalizedPath);
          }
        }
      }
    }
    
    // Add new images to the current list
    setUploadedImages(prev => [...prev, ...newImages]);
    
    toast({
      title: "Success",
      description: `${newImages.length} image(s) ready to be saved with vehicle!`,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-add-vehicle">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-make">Vehicle Make *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-vehicle-make">
                      <SelectValue placeholder="Select Make..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {carMakes.map((make) => (
                      <SelectItem key={make} value={make} data-testid={`option-make-${make.toLowerCase()}`}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-model">Model *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="e.g., Camry, Accord" data-testid="input-vehicle-model" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-year">Year *</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="1990"
                    max={new Date().getFullYear() + 1}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    data-testid="input-vehicle-year"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-price">Price *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="25000" data-testid="input-vehicle-price" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-mileage">Mileage</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min="0"
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    data-testid="input-vehicle-mileage"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-transmission">Transmission</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-vehicle-transmission">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {transmissionTypes.map((type) => (
                      <SelectItem key={type} value={type} data-testid={`option-transmission-${type.toLowerCase()}`}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="drivetrain"
            render={({ field }) => (
              <FormItem>
                <FormLabel data-testid="label-vehicle-drivetrain">Drivetrain</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-vehicle-drivetrain">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {drivetrainTypes.map((type) => (
                      <SelectItem key={type} value={type} data-testid={`option-drivetrain-${type.toLowerCase()}`}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Features Section */}
        <div className="space-y-4">
          <FormLabel className="text-base font-medium" data-testid="label-vehicle-features">Vehicle Features</FormLabel>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 border rounded-lg p-4 bg-gray-50/50">
            {vehicleFeatures.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFeatures.includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                  data-testid={`checkbox-feature-${feature.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <label
                  htmlFor={`feature-${feature}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {feature}
                </label>
              </div>
            ))}
          </div>
          {selectedFeatures.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-muted-foreground mb-2">
                Selected features ({selectedFeatures.length}):
              </p>
              <div className="flex flex-wrap gap-1">
                {selectedFeatures.map((feature) => (
                  <span
                    key={feature}
                    className="inline-flex items-center px-2 py-1 text-xs bg-primary/10 text-primary rounded"
                  >
                    {feature}
                    <button
                      type="button"
                      onClick={() => handleFeatureChange(feature, false)}
                      className="ml-1 text-primary hover:text-primary/80"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel data-testid="label-vehicle-description">Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Additional details about the vehicle..." data-testid="textarea-vehicle-description" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Image Upload Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Vehicle Images</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <div className="upload-button-wrapper" onClick={(e) => e.stopPropagation()}>
              <ObjectUploader
                maxNumberOfFiles={10}
                maxFileSize={10485760}
                onGetUploadParameters={handleGetUploadParameters}
                onComplete={handleUploadComplete}
                buttonClassName="w-full min-h-[80px] bg-white hover:bg-gray-50 border border-gray-300 rounded-lg"
              >
              <div className="flex items-center justify-center h-full py-6 px-4" onClick={(e) => e.preventDefault()}>
                <div className="text-center">
                  <div className="text-sm text-gray-600 font-medium">
                    Click to upload vehicle images
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (up to 10 images, 10MB each)
                  </div>
                </div>
              </div>
              </ObjectUploader>
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  {uploadedImages.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Vehicle ${index + 1}`} 
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={saveVehicleMutation.isPending}
          data-testid="button-submit-vehicle"
        >
          {saveVehicleMutation.isPending ? 
            (mode === 'edit' ? "Updating Vehicle..." : "Adding Vehicle...") : 
            (mode === 'edit' ? "Update Vehicle" : "Add Vehicle")
          }
        </Button>

      </form>
    </Form>
  );
}
