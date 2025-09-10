export default function Terms() {
  return (
    <div className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-terms-title">
            Auto Broker Service Terms & Conditions
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-terms-subtitle">
            Castle Motors Professional Auto Broker Service Agreement
          </p>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Overview</h2>
              <p>
                Castle Motors ("Company") provides professional auto broker services to locate, inspect, bid on, and acquire vehicles at dealer-only auctions on behalf of clients ("Customer"). This service includes comprehensive vehicle search, professional inspection, strategic bidding, and complete transaction management.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Deposit Terms</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">$500 Service Deposit</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A non-refundable $500 service deposit is required to initiate broker services</li>
                  <li>This deposit serves as payment for professional broker services regardless of outcome</li>
                  <li>The deposit covers up to 30 days of active vehicle search and bidding activities</li>
                  <li>$250 of the deposit may be refunded only if no suitable vehicles are found within 30 days and Customer has been reasonable in their requirements</li>
                  <li>The deposit does not cover the actual vehicle purchase price or auction fees</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Auction Budget Deposit</h2>
              <div className="space-y-4">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A separate auction budget deposit is required 24 hours before bidding begins</li>
                  <li>This deposit amount is based on Customer's maximum bid budget plus applicable auction fees</li>
                  <li>Auction budget deposits are fully refundable if no vehicle is successfully acquired</li>
                  <li>If a vehicle is won, the deposit is applied toward the total purchase price</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Service Scope & Responsibilities</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Company Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Search dealer-only auctions nationwide for vehicles matching Customer specifications</li>
                  <li>Provide professional vehicle inspections by certified technicians</li>
                  <li>Develop strategic bidding approaches based on market analysis</li>
                  <li>Handle all auction registration, bidding, and transaction processes</li>
                  <li>Coordinate vehicle title transfer and delivery arrangements</li>
                  <li>Provide regular updates on search progress and available vehicles</li>
                </ul>

                <h3 className="text-xl font-medium">Customer Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate and complete vehicle specifications and requirements</li>
                  <li>Respond promptly to communications regarding potential vehicles</li>
                  <li>Provide auction budget deposits in a timely manner</li>
                  <li>Maintain reasonable expectations regarding vehicle availability and condition</li>
                  <li>Complete final purchase transactions within agreed timeframes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Vehicle Inspection & Condition</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>All vehicles undergo professional inspection prior to bidding</li>
                <li>Inspection reports include mechanical, cosmetic, and operational assessments</li>
                <li>Auction vehicles are sold "as-is" with no warranties from auction houses</li>
                <li>Customer acknowledges that used vehicles may have undisclosed issues</li>
                <li>Company provides inspection expertise but cannot guarantee against all defects</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Bidding & Purchase Process</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Company bids up to Customer's pre-approved maximum budget</li>
                <li>Bidding strategy is at Company's professional discretion</li>
                <li>Successful bids create binding purchase obligations</li>
                <li>Auction fees, transportation, and taxes are Customer's responsibility</li>
                <li>Failed bids do not result in any additional charges to Customer</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Company's liability is limited to the amount of service deposits paid</li>
                <li>Company is not liable for vehicle defects, auction house policies, or market conditions</li>
                <li>Customer assumes all risks associated with auction vehicle purchases</li>
                <li>Company makes no warranties regarding vehicle condition, title, or suitability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cancellation Policy</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Customer may cancel service at any time with written notice</li>
                <li>Service deposits are non-refundable except as specified above</li>
                <li>Auction budget deposits are refundable if no active bids are pending</li>
                <li>Cancellation does not affect obligations for vehicles already won at auction</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Disputes will be resolved through binding arbitration in Georgia</li>
                <li>Georgia state law governs this agreement</li>
                <li>Customer waives right to jury trial and class action participation</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <div className="bg-muted p-6 rounded-lg">
                <p className="font-medium mb-2">Castle Motors LLC</p>
                <p>2759 Delk Rd Ste 1190, Marietta, GA 30067</p>
                <p>Phone: (678) 744-2145</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Licensed Auto Dealer - Georgia
                </p>
              </div>
            </section>

            <section>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-6 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Important:</strong> By using our auto broker service, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. These terms may be updated periodically, and continued use of our services constitutes acceptance of any modifications.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}