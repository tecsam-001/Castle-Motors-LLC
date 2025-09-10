import { useState } from "react";
import BrokerForm from "@/components/BrokerForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Broker() {
  return (
    <div className="py-16 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-broker-title">
            Professional Auto Broker Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-broker-subtitle">
            Let our experts find and secure the perfect vehicle for you at auction.
            Save time, money, and get access to dealer-only auctions nationwide.
          </p>
        </div>

        {/* Service Details - Centered */}
        <div className="flex justify-center mb-16">
          <div className="w-full max-w-2xl">
            <Card className="shadow-lg border border-border" data-testid="card-broker-package">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground" data-testid="text-package-title">
                  Complete Broker Package - $500
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1" data-testid="text-inspection-title">
                      Professional Vehicle Inspection
                    </h4>
                    <p className="text-muted-foreground" data-testid="text-inspection-description">
                      Comprehensive inspection at multiple auction locations by certified technicians
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1" data-testid="text-bidding-title">
                      Expert Bidding Strategy
                    </h4>
                    <p className="text-muted-foreground" data-testid="text-bidding-description">
                      Strategic bidding based on market analysis and vehicle condition
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Check className="w-4 h-4 text-background" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1" data-testid="text-documentation-title">
                      Complete Documentation
                    </h4>
                    <p className="text-muted-foreground" data-testid="text-documentation-description">
                      All paperwork, title transfer, and delivery coordination included
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/20" data-testid="card-deposit-info">
                  <h4 className="font-semibold text-foreground mb-2" data-testid="text-deposit-title">
                    Deposit Requirements
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p className="text-muted-foreground" data-testid="text-service-deposit">
                      <strong>Service Deposit:</strong> A $500 deposit is required to begin the broker service. This deposit is applied toward the final $500 fee upon successful vehicle acquisition.
                    </p>
                    <p className="text-muted-foreground" data-testid="text-auction-deposit">
                      <strong>Auction Budget Deposit:</strong> An additional deposit for your auction budget is required 24 hours before the auction starts. This amount will be based on your maximum bid budget.
                    </p>
                    <p className="text-muted-foreground" data-testid="text-refund-policy">
                      $250 of the service deposit is refundable if no suitable vehicle is found within 30 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Broker Service Form */}
        <Card className="shadow-lg border border-border" data-testid="card-broker-form">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-foreground" data-testid="text-form-title">
              Request Auto Broker Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BrokerForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
