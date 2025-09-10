import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertBrokerRequestSchema, type InsertBrokerRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, CreditCard, CheckCircle } from "lucide-react";
import PaymentCheckout from "@/components/PaymentCheckout";
import { Link } from "wouter";
import { z } from "zod";

const carMakes = [
  "Acura", "Audi", "BMW", "Cadillac", "Chevrolet", "Chrysler", "Dodge",
  "Ford", "GMC", "Honda", "Hyundai", "Infiniti", "Jeep", "Kia", "Lexus",
  "Mazda", "Mercedes-Benz", "Nissan", "Subaru", "Toyota", "Volkswagen", "Volvo"
];

const years = [
  "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014 or older"
];

const mileageRanges = [
  "Any Mileage", "0 - 25,000 miles", "25,000 - 50,000 miles", 
  "50,000 - 75,000 miles", "75,000 - 100,000 miles", "100,000+ miles"
];

// Extended schema for multiple vehicle selections
const extendedBrokerRequestSchema = insertBrokerRequestSchema.extend({
  vehicleSelections: z.array(z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    yearRange: z.string().min(1, "Year range is required")
  })).min(1, "At least one vehicle selection is required").max(5, "Maximum 5 vehicle selections allowed")
});

type ExtendedBrokerRequest = z.infer<typeof extendedBrokerRequestSchema>;

export default function BrokerForm() {
  const { toast } = useToast();
  const [showPayment, setShowPayment] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [savedFormData, setSavedFormData] = useState<ExtendedBrokerRequest | null>(null);

  const form = useForm<ExtendedBrokerRequest>({
    resolver: zodResolver(extendedBrokerRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      vehicleSelections: [{ make: "", model: "", yearRange: "" }],
      maxBudget: "",
      mileageRange: "",
      additionalRequirements: "",
      depositAgreed: "true",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicleSelections"
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ExtendedBrokerRequest) => {
      const response = await apiRequest("POST", "/api/broker-requests", data);
      return response.json();
    },
    onSuccess: () => {
      setIsCompleted(true);
      toast({
        title: "Request & Payment Complete!",
        description: "Your auto broker request has been submitted and payment processed successfully. We'll contact you within 24 hours to begin your vehicle search.",
      });
      form.reset();
      setSavedFormData(null);
      setShowPayment(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ExtendedBrokerRequest) => {
    // Save form data and show payment modal
    setSavedFormData(data);
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    // Submit the broker request after successful payment
    if (savedFormData) {
      submitMutation.mutate(savedFormData);
    }
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setSavedFormData(null);
  };

  const addVehicleSelection = () => {
    if (fields.length < 5) {
      append({ make: "", model: "", yearRange: "" });
    }
  };

  const removeVehicleSelection = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-broker-request">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-first-name">First Name *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-first-name" />
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
                    <FormLabel data-testid="label-last-name">Last Name *</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-last-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-email">Email *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" data-testid="input-email" />
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
                    <FormLabel data-testid="label-phone">Phone *</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" data-testid="input-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Selections */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              Vehicle Preferences (Up to 5)
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addVehicleSelection}
                disabled={fields.length >= 5}
                data-testid="button-add-vehicle"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Vehicle
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="border border-border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Vehicle Option {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeVehicleSelection(index)}
                      data-testid={`button-remove-vehicle-${index}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`vehicleSelections.${index}.make`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid={`label-vehicle-make-${index}`}>Vehicle Make *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid={`select-vehicle-make-${index}`}>
                              <SelectValue placeholder="Select Make..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {carMakes.map((make) => (
                              <SelectItem key={make} value={make.toLowerCase()} data-testid={`option-make-${make.toLowerCase()}-${index}`}>
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
                    name={`vehicleSelections.${index}.model`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid={`label-vehicle-model-${index}`}>Model *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Camry, Accord, 3 Series" data-testid={`input-vehicle-model-${index}`} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`vehicleSelections.${index}.yearRange`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel data-testid={`label-year-range-${index}`}>Year Range *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid={`select-year-range-${index}`}>
                              <SelectValue placeholder="Select Year..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {years.map((year) => (
                              <SelectItem key={year} value={year} data-testid={`option-year-${year.replace(" ", "-").toLowerCase()}-${index}`}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Budget and Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Budget & Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="maxBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-max-budget">Maximum Budget *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., $25,000" data-testid="input-max-budget" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mileageRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel data-testid="label-mileage-range">Preferred Mileage Range</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-mileage-range">
                          <SelectValue placeholder="Any Mileage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mileageRanges.map((range) => (
                          <SelectItem key={range} value={range} data-testid={`option-mileage-${range.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}`}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel data-testid="label-additional-requirements">Additional Requirements or Preferences</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      rows={4}
                      placeholder="Tell us about any specific features, colors, or other requirements..."
                      data-testid="textarea-additional-requirements"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Agreement */}
        <FormField
          control={form.control}
          name="depositAgreed"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value === "true"}
                  onCheckedChange={(checked) => field.onChange(checked ? "true" : "false")}
                  data-testid="checkbox-deposit-agreement"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm text-muted-foreground" data-testid="label-deposit-agreement">
                  I understand that a $500 deposit is required to begin the broker service, and I agree to the terms and conditions. *
                </FormLabel>
                <div className="mt-2">
                  <Link 
                    href="/terms" 
                    className="text-xs text-primary hover:text-primary/80 underline transition-colors"
                    data-testid="link-terms-conditions"
                  >
                    View Full Terms & Conditions
                  </Link>
                </div>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          disabled={submitMutation.isPending || isCompleted}
          data-testid="button-submit-broker-request"
        >
          {submitMutation.isPending ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
              Processing...
            </div>
          ) : isCompleted ? (
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Request Complete!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Proceed to Payment ($500)
            </div>
          )}
        </Button>
      </form>

      {/* Payment Modal */}
      <PaymentCheckout
        isOpen={showPayment}
        onSuccess={handlePaymentSuccess}
        onClose={handlePaymentClose}
      />

      {/* Success State */}
      {isCompleted && (
        <Card className="mt-6 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                Request & Payment Complete!
              </h3>
              <p className="text-green-800 dark:text-green-200 max-w-md mx-auto">
                Your auto broker request has been submitted successfully and your $500 deposit has been processed. 
                We'll contact you within 24 hours to begin your personalized vehicle search.
              </p>
              <Button
                onClick={() => {
                  setIsCompleted(false);
                  form.reset();
                }}
                variant="outline"
                className="mt-4"
              >
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Form>
  );
}