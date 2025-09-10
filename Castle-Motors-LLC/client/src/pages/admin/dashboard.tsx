import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import VehicleForm from "@/components/VehicleForm";
import MarketingAnalytics from "@/components/MarketingAnalytics";
import type { Vehicle, BrokerRequest, VehicleInquiry, ContactInquiry } from "@shared/schema";
import { Plus, LogOut, Car, Users, MessageSquare, Edit, Trash2, Eye, BarChart3, Image } from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch vehicles
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery<Vehicle[]>({
    queryKey: ["/api/vehicles"],
  });

  // Fetch broker requests
  const { data: brokerRequests = [], isLoading: brokerLoading } = useQuery<BrokerRequest[]>({
    queryKey: ["/api/broker-requests"],
  });

  // Fetch vehicle inquiries
  const { data: vehicleInquiries = [], isLoading: vehicleInquiriesLoading } = useQuery<VehicleInquiry[]>({
    queryKey: ["/api/vehicle-inquiries"],
  });

  // Fetch contact inquiries
  const { data: contactInquiries = [], isLoading: contactInquiriesLoading, refetch: refetchContactInquiries } = useQuery<ContactInquiry[]>({
    queryKey: ["/api/contact-inquiries"],
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      setLocation("/");
    },
  });

  // Delete vehicle mutation
  const deleteVehicleMutation = useMutation({
    mutationFn: async (vehicleId: string) => {
      return await apiRequest("DELETE", `/api/vehicles/${vehicleId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Vehicle deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete vehicle",
        variant: "destructive",
      });
    },
  });

  // Delete vehicle inquiry mutation
  const deleteVehicleInquiryMutation = useMutation({
    mutationFn: async (inquiryId: string) => {
      return await apiRequest("DELETE", `/api/vehicle-inquiries/${inquiryId}`);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Deleted",
        description: "Vehicle inquiry has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicle-inquiries"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete vehicle inquiry",
        variant: "destructive",
      });
    },
  });

  // Delete contact inquiry mutation
  const deleteContactInquiryMutation = useMutation({
    mutationFn: async (inquiryId: string) => {
      return await apiRequest("DELETE", `/api/contact-inquiries/${inquiryId}`);
    },
    onSuccess: () => {
      toast({
        title: "Inquiry Deleted",
        description: "Contact inquiry has been successfully deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/contact-inquiries"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contact inquiry",
        variant: "destructive",
      });
    },
  });

  // Process existing images mutation
  const processImagesMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/admin/process-images");
    },
    onSuccess: async (response) => {
      const result = await response.json();
      toast({
        title: "Image Processing Complete",
        description: `Processed ${result.processedCount} images with ${result.errorCount} errors across ${result.totalVehicles} vehicles`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process existing images",
        variant: "destructive",
      });
    },
  });

  const handleVehicleAdded = () => {
    setShowAddVehicle(false);
    setEditingVehicle(null);
    queryClient.invalidateQueries({ queryKey: ["/api/vehicles"] });
    toast({
      title: "Success",
      description: editingVehicle ? "Vehicle updated successfully" : "Vehicle added to inventory successfully",
    });
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setShowAddVehicle(true);
  };

  const handleCancelEdit = () => {
    setShowAddVehicle(false);
    setEditingVehicle(null);
  };

  const handleViewDetails = (vehicle: Vehicle) => {
    setLocation(`/vehicle/${vehicle.id}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <img 
                  src="/castle-motors-logo.png" 
                  alt="Castle Motors"
                  className="h-10 w-auto"
                />
              </Link>
              <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                View Website
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-admin-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {logoutMutation.isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="inventory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 gap-0.5 h-auto p-1">
            <TabsTrigger value="inventory" className="flex items-center gap-1 px-1.5 sm:px-3 py-1.5 text-xs">
              <Car className="h-3 w-3" />
              <span className="hidden sm:inline">Inventory</span>
              <span className="sm:hidden">Inv</span>
            </TabsTrigger>
            <TabsTrigger value="broker-requests" className="flex items-center gap-1 px-1.5 sm:px-3 py-1.5 text-xs">
              <Users className="h-3 w-3" />
              <span className="hidden sm:inline">Brokers</span>
              <span className="sm:hidden">Bro</span>
            </TabsTrigger>
            <TabsTrigger value="vehicle-inquiries" className="flex items-center gap-1 px-1.5 sm:px-3 py-1.5 text-xs">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">Vehicle</span>
              <span className="sm:hidden">Veh</span>
            </TabsTrigger>
            <TabsTrigger value="contact-inquiries" className="flex items-center gap-1 px-1.5 sm:px-3 py-1.5 text-xs">
              <MessageSquare className="h-3 w-3" />
              <span className="hidden sm:inline">Contact</span>
              <span className="sm:hidden">Con</span>
            </TabsTrigger>
            <TabsTrigger value="marketing-analytics" className="flex items-center gap-1 px-1.5 sm:px-3 py-1.5 text-xs">
              <BarChart3 className="h-3 w-3" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Ana</span>
            </TabsTrigger>
          </TabsList>

          {/* Vehicle Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Vehicle Inventory</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Manage your vehicle inventory</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => {
                    if (showAddVehicle && editingVehicle) {
                      handleCancelEdit();
                    } else {
                      setShowAddVehicle(!showAddVehicle);
                      setEditingVehicle(null);
                    }
                  }}
                  className="bg-primary hover:bg-primary/90"
                  data-testid="button-add-vehicle"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {showAddVehicle ? "Cancel" : "Add Vehicle"}
                </Button>
                <Button 
                  onClick={() => processImagesMutation.mutate()}
                  disabled={processImagesMutation.isPending}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  data-testid="button-process-images"
                >
                  <Image className="h-4 w-4 mr-2" />
                  {processImagesMutation.isPending ? "Processing..." : "Process Images"}
                </Button>
              </div>
            </div>

            {showAddVehicle && (
              <Card>
                <CardHeader>
                  <CardTitle>{editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}</CardTitle>
                  <CardDescription>
                    {editingVehicle ? "Update vehicle details and images" : "Add a new vehicle to your inventory with multiple images"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <VehicleForm 
                    onSuccess={handleVehicleAdded} 
                    vehicle={editingVehicle || undefined}
                    mode={editingVehicle ? 'edit' : 'create'}
                  />
                </CardContent>
              </Card>
            )}

            {vehiclesLoading ? (
              <div className="text-center py-8">Loading vehicles...</div>
            ) : vehicles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No vehicles in inventory</p>
                <p className="text-sm text-muted-foreground mt-2">Click "Add Vehicle" to add your first vehicle</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <Card key={vehicle.id} className="overflow-hidden">
                    <div className="aspect-video relative bg-gray-100">
                      {vehicle.images && vehicle.images.length > 0 ? (
                        <img 
                          src={vehicle.images[0]} 
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          vehicle.status === 'available' ? 'bg-green-500' :
                          vehicle.status === 'sold' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                      >
                        {vehicle.status}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </h3>
                      <p className="text-2xl font-bold text-primary mt-2">
                        ${parseFloat(vehicle.price).toLocaleString()}
                      </p>
                      <div className="mt-4 space-y-3">
                        <span className="text-sm text-muted-foreground block">
                          {vehicle.mileage?.toLocaleString()} miles
                        </span>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewDetails(vehicle)}
                            data-testid={`button-view-details-${vehicle.id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditVehicle(vehicle)}
                            data-testid={`button-edit-vehicle-${vehicle.id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => deleteVehicleMutation.mutate(vehicle.id)}
                            disabled={deleteVehicleMutation.isPending}
                            data-testid={`button-delete-vehicle-${vehicle.id}`}
                            className="flex-1 sm:flex-none"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Broker Requests Tab */}
          <TabsContent value="broker-requests" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Broker Service Requests</h2>
              <p className="text-muted-foreground">View and manage all broker service requests</p>
            </div>

            {brokerLoading ? (
              <div className="text-center py-8">Loading broker requests...</div>
            ) : (
              <div className="space-y-4">
                {brokerRequests.map((request) => (
                  <Card key={request.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {request.firstName} {request.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={getStatusBadgeColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong>Contact:</strong>
                          <p>{request.email}</p>
                          <p>{request.phone}</p>
                        </div>
                        <div>
                          <strong>Budget:</strong>
                          <p>{request.maxBudget}</p>
                          {request.mileageRange && (
                            <>
                              <strong>Mileage:</strong>
                              <p>{request.mileageRange}</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <strong>Vehicle Selections:</strong>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                          {request.vehicleSelections.map((selection, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded-lg">
                              <p className="font-medium">{selection.make} {selection.model}</p>
                              <p className="text-sm text-muted-foreground">{selection.yearRange}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {request.additionalRequirements && (
                        <div>
                          <strong>Additional Requirements:</strong>
                          <p className="mt-1">{request.additionalRequirements}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {brokerRequests.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">No broker requests yet</h3>
                      <p className="text-muted-foreground">Broker service requests will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Vehicle Inquiries Tab */}
          <TabsContent value="vehicle-inquiries" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Vehicle Inquiries</h2>
              <p className="text-muted-foreground">View and manage all vehicle inquiries from customers</p>
            </div>

            {vehicleInquiriesLoading ? (
              <div className="text-center py-8">Loading vehicle inquiries...</div>
            ) : (
              <div className="space-y-4">
                {vehicleInquiries.map((inquiry: VehicleInquiry) => {
                  const vehicle = vehicles.find(v => v.id === inquiry.vehicleId);
                  return (
                    <Card key={inquiry.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {inquiry.firstName} {inquiry.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(inquiry.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusBadgeColor(inquiry.status)}>
                              {inquiry.status}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteVehicleInquiryMutation.mutate(inquiry.id)}
                              disabled={deleteVehicleInquiryMutation.isPending}
                              data-testid={`button-delete-vehicle-inquiry-${inquiry.id}`}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <strong>Contact:</strong>
                            <p>{inquiry.email}</p>
                            <p>{inquiry.phone}</p>
                          </div>
                          <div>
                            <strong>Vehicle:</strong>
                            {vehicle ? (
                              <p>{vehicle.year} {vehicle.make} {vehicle.model} - ${parseFloat(vehicle.price).toLocaleString()}</p>
                            ) : (
                              <p>Vehicle not found (ID: {inquiry.vehicleId})</p>
                            )}
                          </div>
                        </div>

                        {inquiry.message && (
                          <div>
                            <strong>Message:</strong>
                            <p className="text-sm text-muted-foreground mt-1">
                              {inquiry.message}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
                {vehicleInquiries.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">No vehicle inquiries yet</h3>
                      <p className="text-muted-foreground">Customer inquiries about vehicles will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Contact Inquiries Tab */}
          <TabsContent value="contact-inquiries" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Contact Inquiries</h2>
              <p className="text-muted-foreground">View and manage all general contact inquiries</p>
            </div>

            {contactInquiriesLoading ? (
              <div className="text-center py-8">Loading contact inquiries...</div>
            ) : (
              <div className="space-y-4">
                {Array.isArray(contactInquiries) && contactInquiries.map((inquiry: ContactInquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">
                            {inquiry.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(inquiry.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusBadgeColor(inquiry.status)}>
                            {inquiry.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteContactInquiryMutation.mutate(inquiry.id)}
                            disabled={deleteContactInquiryMutation.isPending}
                            data-testid={`button-delete-contact-inquiry-${inquiry.id}`}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <strong>Contact:</strong>
                          <p>{inquiry.email}</p>
                        </div>
                        <div>
                          <strong>Subject:</strong>
                          <p>{inquiry.subject}</p>
                        </div>
                      </div>

                      <div>
                        <strong>Message:</strong>
                        <p className="text-sm text-muted-foreground mt-1">
                          {inquiry.message}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {Array.isArray(contactInquiries) && contactInquiries.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-muted-foreground">No contact inquiries yet</h3>
                      <p className="text-muted-foreground">Contact inquiries will appear here</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Marketing Analytics Tab */}
          <TabsContent value="marketing-analytics" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">Marketing Analytics</h2>
                <p className="text-sm sm:text-base text-muted-foreground">Track how customers find your website</p>
              </div>
            </div>

            <MarketingAnalytics />
          </TabsContent>
        </Tabs>
      </main>

    </div>
  );
}