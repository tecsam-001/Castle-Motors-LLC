import ContactForm from "@/components/ContactForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Contact() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            Get In Touch
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-contact-subtitle">
            Ready to find your next vehicle? Contact Castle Motors today.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2" data-testid="text-location-title">
                    Office
                  </h3>
                  <p className="text-muted-foreground" data-testid="text-location-address">
                    2759 Delk Rd Ste 1190<br />
                    Marietta, GA 30067
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2" data-testid="text-phone-title">
                    Phone & Hours
                  </h3>
                  <p className="text-muted-foreground" data-testid="text-phone-hours">
                    Sales and Service: (678) 744-2145<br />
                    Broker Service: (404) 220-9234<br />
                    Monday - Saturday: 9:00 AM - 7:00 PM<br />
                    Sunday: 12:00 PM - 5:00 PM
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-foreground rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground mb-2" data-testid="text-email-title">
                    Email Us
                  </h3>
                  <p className="text-muted-foreground" data-testid="text-email-addresses">
                    castlemotorsatl@gmail.com
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <Card className="shadow-lg border border-border" data-testid="card-contact-form">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-foreground" data-testid="text-form-title">
                Quick Inquiry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
