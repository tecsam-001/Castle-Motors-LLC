import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertVehicleSchema, insertBrokerRequestSchema, insertContactInquirySchema, insertVehicleInquirySchema, insertAdminUserSchema, insertMarketingSourceSchema } from "@shared/schema";
import { ObjectStorageService } from "./objectStorage";
import session from "express-session";
import bcrypt from "bcrypt";
import Stripe from "stripe";

// Simple admin authentication middleware
function isAdminAuthenticated(req: any, res: any, next: any) {
  if (req.session?.adminUser) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized - Admin access required" });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe - will be null if keys aren't provided yet
  let stripe: Stripe | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-08-27.basil",
    });
  }
  // Session middleware for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'castle-motors-admin-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Initialize default admin user
  try {
    await storage.initializeDefaultAdmin();
    console.log("Default admin user initialized");
  } catch (error) {
    console.error("Failed to initialize default admin user:", error);
  }

  // Admin authentication routes
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const adminUser = await storage.getAdminUserByUsername(username);
      if (!adminUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isPasswordValid = await bcrypt.compare(password, adminUser.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Store admin user in session
      (req.session as any).adminUser = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email
      };

      res.json({ success: true, admin: { username: adminUser.username, email: adminUser.email } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session?.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/me", isAdminAuthenticated, (req, res) => {
    res.json((req.session as any).adminUser);
  });
  // Vehicle routes
  app.get("/api/vehicles", async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      res.json(vehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      res.status(500).json({ error: "Failed to fetch vehicles" });
    }
  });

  app.get("/api/vehicles/:id", async (req, res) => {
    try {
      const vehicle = await storage.getVehicleById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
      res.status(500).json({ error: "Failed to fetch vehicle" });
    }
  });

  app.post("/api/vehicles", isAdminAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.parse(req.body);
      const vehicle = await storage.createVehicle(validatedData);
      res.status(201).json(vehicle);
    } catch (error) {
      console.error("Error creating vehicle:", error);
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  app.put("/api/vehicles/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const validatedData = insertVehicleSchema.partial().parse(req.body);
      const vehicle = await storage.updateVehicle(req.params.id, validatedData);
      if (!vehicle) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.json(vehicle);
    } catch (error) {
      console.error("Error updating vehicle:", error);
      res.status(400).json({ error: "Invalid vehicle data" });
    }
  });

  app.delete("/api/vehicles/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteVehicle(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Vehicle not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      res.status(500).json({ error: "Failed to delete vehicle" });
    }
  });

  // Broker request routes
  app.get("/api/broker-requests", isAdminAuthenticated, async (req, res) => {
    try {
      const requests = await storage.getAllBrokerRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching broker requests:", error);
      res.status(500).json({ error: "Failed to fetch broker requests" });
    }
  });

  app.post("/api/broker-requests", async (req, res) => {
    try {
      // Handle both old format (with single vehicle) and new format (with multiple vehicles)
      let brokerData = req.body;
      
      // If this is the new format with vehicleSelections array, use it directly
      if (brokerData.vehicleSelections && Array.isArray(brokerData.vehicleSelections)) {
        // New format - validate and create
        const validatedData = {
          firstName: brokerData.firstName,
          lastName: brokerData.lastName,
          email: brokerData.email,
          phone: brokerData.phone,
          vehicleSelections: brokerData.vehicleSelections,
          maxBudget: brokerData.maxBudget,
          mileageRange: brokerData.mileageRange || null,
          additionalRequirements: brokerData.additionalRequirements || null,
          depositAgreed: brokerData.depositAgreed || "true"
        };
        
        const request = await storage.createBrokerRequest(validatedData);
        res.status(201).json(request);
      } else {
        // Old format - convert to new format for backward compatibility
        const validatedData = insertBrokerRequestSchema.parse(brokerData);
        const request = await storage.createBrokerRequest(validatedData);
        res.status(201).json(request);
      }
    } catch (error) {
      console.error("Error creating broker request:", error);
      res.status(400).json({ error: "Invalid broker request data" });
    }
  });

  // Contact inquiry routes
  app.get("/api/contact-inquiries", isAdminAuthenticated, async (req, res) => {
    try {
      const inquiries = await storage.getAllContactInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching contact inquiries:", error);
      res.status(500).json({ error: "Failed to fetch contact inquiries" });
    }
  });

  app.post("/api/contact-inquiries", async (req, res) => {
    try {
      const validatedData = insertContactInquirySchema.parse(req.body);
      const inquiry = await storage.createContactInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Error creating contact inquiry:", error);
      res.status(400).json({ error: "Invalid contact inquiry data" });
    }
  });

  app.delete("/api/contact-inquiries/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteContactInquiry(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact inquiry not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting contact inquiry:", error);
      res.status(500).json({ error: "Failed to delete contact inquiry" });
    }
  });

  // Vehicle inquiry routes
  app.get("/api/vehicle-inquiries", isAdminAuthenticated, async (req, res) => {
    try {
      const inquiries = await storage.getAllVehicleInquiries();
      res.json(inquiries);
    } catch (error) {
      console.error("Error fetching vehicle inquiries:", error);
      res.status(500).json({ error: "Failed to fetch vehicle inquiries" });
    }
  });

  app.post("/api/vehicle-inquiries", async (req, res) => {
    try {
      const validatedData = insertVehicleInquirySchema.parse(req.body);
      const inquiry = await storage.createVehicleInquiry(validatedData);
      res.status(201).json(inquiry);
    } catch (error: any) {
      console.error("Error creating vehicle inquiry:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ 
          error: "Validation failed", 
          details: error.errors 
        });
      } else {
        res.status(500).json({ error: "Failed to create vehicle inquiry" });
      }
    }
  });

  app.delete("/api/vehicle-inquiries/:id", isAdminAuthenticated, async (req, res) => {
    try {
      const success = await storage.deleteVehicleInquiry(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Vehicle inquiry not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting vehicle inquiry:", error);
      res.status(500).json({ error: "Failed to delete vehicle inquiry" });
    }
  });

  // Marketing source routes
  app.get("/api/marketing-sources", isAdminAuthenticated, async (req, res) => {
    try {
      const sources = await storage.getAllMarketingSources();
      res.json(sources);
    } catch (error) {
      console.error("Error fetching marketing sources:", error);
      res.status(500).json({ error: "Failed to fetch marketing sources" });
    }
  });

  app.post("/api/marketing-sources", async (req, res) => {
    try {
      const validatedData = insertMarketingSourceSchema.parse(req.body);
      const source = await storage.createMarketingSource(validatedData);
      res.status(201).json(source);
    } catch (error) {
      console.error("Error creating marketing source:", error);
      res.status(400).json({ error: "Invalid marketing source data" });
    }
  });

  app.get("/api/marketing-sources/stats", isAdminAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getMarketingSourceStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching marketing source stats:", error);
      res.status(500).json({ error: "Failed to fetch marketing source stats" });
    }
  });

  // Stripe payment routes for broker service
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ 
        error: "Stripe not configured. Please contact administrator to set up payment processing." 
      });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          service: "broker_deposit",
          description: "Castle Motors Auto Broker Service Deposit"
        }
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Object storage routes for vehicle images
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(404).json({ error: "File not found" });
    }
  });

  app.post("/api/objects/upload", isAdminAuthenticated, async (req, res) => {
    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  app.put("/api/vehicle-images", isAdminAuthenticated, async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const objectPath = objectStorageService.normalizeObjectEntityPath(req.body.imageURL);
      
      // Process the uploaded image (resize and watermark)
      try {
        // Extract bucket and object name from the URL for processing
        const url = new URL(req.body.imageURL);
        const pathParts = url.pathname.split('/');
        const bucketName = pathParts[1]; // First part after /
        const objectName = pathParts.slice(2).join('/'); // Rest of the path
        
        // Import and use image processor
        const { imageProcessor } = await import('./imageProcessor');
        await imageProcessor.processAndReplaceImage(bucketName, objectName);
        
        console.log("Image processed successfully with resize and watermark");
      } catch (processingError) {
        console.error("Error processing image, but continuing:", processingError);
        // Continue even if image processing fails
      }
      
      // If vehicleId is provided, update the vehicle's images array
      if (req.body.vehicleId) {
        const vehicle = await storage.getVehicleById(req.body.vehicleId);
        if (!vehicle) {
          return res.status(404).json({ error: "Vehicle not found" });
        }

        const currentImages = vehicle.images || [];
        const updatedImages = [...currentImages, objectPath];
        
        await storage.updateVehicle(req.body.vehicleId, { images: updatedImages });
      }

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error processing vehicle image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin endpoint to process existing vehicle images
  app.post("/api/admin/process-images", isAdminAuthenticated, async (req, res) => {
    try {
      const vehicles = await storage.getAllVehicles();
      let processedCount = 0;
      let errorCount = 0;

      for (const vehicle of vehicles) {
        if (vehicle.images && vehicle.images.length > 0) {
          for (const imagePath of vehicle.images) {
            try {
              // Skip if already processed or if it's not an object storage path
              if (!imagePath.startsWith('/objects/')) continue;

              // Extract bucket and object name from path
              const pathParts = imagePath.split('/');
              if (pathParts.length < 3) continue;
              
              const bucketName = pathParts[2]; // After /objects/
              const objectName = pathParts.slice(3).join('/'); // Rest of the path

              // Import and process image
              const { imageProcessor } = await import('./imageProcessor');
              await imageProcessor.processAndReplaceImage(bucketName, objectName);
              processedCount++;
            } catch (error) {
              console.error(`Error processing image ${imagePath}:`, error);
              errorCount++;
            }
          }
        }
      }

      res.json({
        message: "Image processing completed",
        processedCount,
        errorCount,
        totalVehicles: vehicles.length
      });
    } catch (error) {
      console.error("Error in bulk image processing:", error);
      res.status(500).json({ error: "Failed to process images" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
