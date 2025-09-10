import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import MarketingSourceSelector from "@/components/MarketingSourceSelector";

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative" data-testid="section-hero">
        <div
          className="h-96 bg-gradient-to-r from-primary/98 to-primary/95 flex items-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundBlendMode: "overlay",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6" data-testid="text-hero-title">
                Your Trusted Partner in{" "}
                <span className="text-secondary">Premium</span> Automotive Sales
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90" data-testid="text-hero-subtitle">
                Quality used vehicles with transparent pricing and trusted service.
                Your satisfaction is our commitment.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/inventory">
                  <Button 
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-8 py-3"
                    data-testid="button-browse-inventory"
                  >
                    Browse Our Inventory
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button 
                    variant="outline" 
                    className="border-2 border-secondary bg-secondary/20 text-secondary hover:bg-secondary hover:text-secondary-foreground font-semibold px-8 py-3"
                    data-testid="button-contact-us"
                  >
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Source Selector */}
      <MarketingSourceSelector />

      {/* Company Info */}
      <section className="py-16 bg-primary" data-testid="section-company-info">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-primary-foreground" data-testid="text-phone-title">Call Us Today</h3>
              <p className="text-primary-foreground/80" data-testid="text-phone-details">
                Sales and Service: (678) 744-2145<br />
                Broker Service: (404) 220-9234<br />
                Mon-Sat 9AM-7PM
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-secondary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-primary-foreground" data-testid="text-service-title">Trusted Service</h3>
              <p className="text-primary-foreground/80" data-testid="text-service-details">
                Licensed & Bonded<br />
                A+ BBB Rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12" data-testid="section-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div className="md:col-span-2">
              <p className="text-background/80 mb-4 max-w-md" data-testid="text-footer-description">
                Your trusted partner in premium automotive sales. 
                Licensed, bonded, and committed to excellence.
              </p>
              <div className="text-background/80 mb-6" data-testid="text-footer-contact">
                <p>2759 Delk Rd Ste 1190, Marietta, GA 30067</p>
                <p>Sales and Service: (678) 744-2145</p>
                <p>Broker Service: (404) 220-9234</p>
              </div>
              <div className="flex items-center">
                <img 
                  src="/castle-motors-logo.png" 
                  alt="Castle Motors"
                  className="h-28 w-auto object-contain"
                />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4" data-testid="text-quick-links-title">Quick Links</h4>
              <ul className="space-y-2 text-background/80">
                <li>
                  <Link href="/inventory" className="hover:text-secondary transition-colors" data-testid="link-footer-inventory">
                    View Inventory
                  </Link>
                </li>
                <li>
                  <Link href="/broker" className="hover:text-secondary transition-colors" data-testid="link-footer-broker">
                    Broker Service
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-secondary transition-colors" data-testid="link-footer-contact">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-secondary transition-colors" data-testid="link-footer-admin">
                    Admin Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-background/20 mt-8 pt-8 text-center text-background/60">
            <p data-testid="text-copyright">&copy; 2025 Castle Motors LLC. All rights reserved. Licensed Auto Dealer - Georgia.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
