import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { InsertMarketingSource } from "@shared/schema";

const marketingSources = [
  { value: "facebook", label: "Facebook", icon: "📘" },
  { value: "google", label: "Google", icon: "🔍" },
  { value: "instagram", label: "Instagram", icon: "📷" },
  { value: "sign", label: "Sign", icon: "🪧" },
  { value: "referral", label: "Referral", icon: "👥" }
];

export default function MarketingSourceSelector() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has already selected a source in this session
    const hasSelected = sessionStorage.getItem('marketing_source_selected');
    if (!hasSelected) {
      // Show popup after 3 seconds
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const sourceMutation = useMutation({
    mutationFn: async (source: string) => {
      const data: InsertMarketingSource = {
        source,
        ipAddress: null,
        userAgent: navigator.userAgent
      };
      return apiRequest("POST", "/api/marketing-sources", data);
    },
    onSuccess: () => {
      // Mark as selected and close popup
      sessionStorage.setItem('marketing_source_selected', 'true');
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Failed to save marketing source:", error);
      // Still close popup and mark as selected to avoid repeated prompts
      sessionStorage.setItem('marketing_source_selected', 'true');
      setIsOpen(false);
    },
  });

  const handleSourceSelect = (source: string) => {
    sourceMutation.mutate(source);
  };

  const handleDismiss = () => {
    sessionStorage.setItem('marketing_source_selected', 'true');
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        handleDismiss();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg">
            How did you find Castle Motors?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Help us understand how our customers discover us
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {marketingSources.map((source) => (
              <Button
                key={source.value}
                variant="outline"
                className="h-16 flex flex-col items-center gap-2 hover:bg-secondary/20 cursor-pointer"
                onClick={() => handleSourceSelect(source.value)}
                disabled={sourceMutation.isPending}
                data-testid={`button-marketing-source-${source.value}`}
                type="button"
              >
                <span className="text-2xl">{source.icon}</span>
                <span className="text-sm font-medium">{source.label}</span>
              </Button>
            ))}
          </div>
          
          {sourceMutation.isPending && (
            <div className="text-center text-sm text-muted-foreground animate-pulse">
              Thank you for your feedback! Saving...
            </div>
          )}
          
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-xs text-muted-foreground"
              data-testid="button-dismiss-marketing-source"
            >
              Skip this question
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}