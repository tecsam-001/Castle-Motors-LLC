import { vehicles, brokerRequests, contactInquiries, vehicleInquiries, marketingSources, users, adminUsers, type Vehicle, type InsertVehicle, type BrokerRequest, type InsertBrokerRequest, type ContactInquiry, type InsertContactInquiry, type VehicleInquiry, type InsertVehicleInquiry, type MarketingSource, type InsertMarketingSource, type User, type InsertUser, type AdminUser, type InsertAdminUser } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Admin user methods
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  initializeDefaultAdmin(): Promise<void>;
  
  // Vehicle methods
  getAllVehicles(): Promise<Vehicle[]>;
  getVehicleById(id: string): Promise<Vehicle | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: string): Promise<boolean>;
  
  // Broker request methods
  getAllBrokerRequests(): Promise<BrokerRequest[]>;
  createBrokerRequest(request: InsertBrokerRequest): Promise<BrokerRequest>;
  
  // Contact inquiry methods
  getAllContactInquiries(): Promise<ContactInquiry[]>;
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  deleteContactInquiry(id: string): Promise<boolean>;
  
  // Vehicle inquiry methods
  getAllVehicleInquiries(): Promise<VehicleInquiry[]>;
  createVehicleInquiry(inquiry: InsertVehicleInquiry): Promise<VehicleInquiry>;
  deleteVehicleInquiry(id: string): Promise<boolean>;
  
  // Marketing source methods
  getAllMarketingSources(): Promise<MarketingSource[]>;
  createMarketingSource(source: InsertMarketingSource): Promise<MarketingSource>;
  getMarketingSourceStats(): Promise<{ source: string; count: number; percentage: number }[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Admin user methods
  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [adminUser] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return adminUser || undefined;
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const [adminUser] = await db
      .insert(adminUsers)
      .values(insertAdminUser)
      .returning();
    return adminUser;
  }

  async initializeDefaultAdmin(): Promise<void> {
    // Check if default admin already exists
    const existingAdmin = await this.getAdminUserByUsername("Castle123");
    if (existingAdmin) {
      return; // Default admin already exists
    }

    // Create default admin user
    const hashedPassword = await bcrypt.hash("Castle877", 10);
    await this.createAdminUser({
      username: "Castle123",
      password: hashedPassword,
      email: "castlemotorsatl@gmail.com"
    });
  }

  // Vehicle methods
  async getAllVehicles(): Promise<Vehicle[]> {
    return await db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return vehicle || undefined;
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const [newVehicle] = await db
      .insert(vehicles)
      .values(vehicle)
      .returning();
    return newVehicle;
  }

  async updateVehicle(id: string, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const [updatedVehicle] = await db
      .update(vehicles)
      .set(vehicle)
      .where(eq(vehicles.id, id))
      .returning();
    return updatedVehicle || undefined;
  }

  async deleteVehicle(id: string): Promise<boolean> {
    const result = await db.delete(vehicles).where(eq(vehicles.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Broker request methods
  async getAllBrokerRequests(): Promise<BrokerRequest[]> {
    return await db.select().from(brokerRequests).orderBy(desc(brokerRequests.createdAt));
  }

  async createBrokerRequest(request: any): Promise<BrokerRequest> {
    // Handle both old format (with individual vehicle fields) and new format (with vehicleSelections array)
    const brokerRequestData: any = {
      firstName: request.firstName,
      lastName: request.lastName,
      email: request.email,
      phone: request.phone,
      maxBudget: request.maxBudget,
      mileageRange: request.mileageRange,
      additionalRequirements: request.additionalRequirements,
      depositAgreed: request.depositAgreed || "true"
    };

    // If new format with vehicleSelections, use it
    if (request.vehicleSelections && Array.isArray(request.vehicleSelections)) {
      brokerRequestData.vehicleSelections = request.vehicleSelections;
      // Clear old fields to maintain compatibility
      brokerRequestData.vehicleMake = "";
      brokerRequestData.vehicleModel = "";
      brokerRequestData.yearRange = "";
    } else {
      // Old format - convert to new format
      brokerRequestData.vehicleSelections = [{
        make: request.vehicleMake || "",
        model: request.vehicleModel || "",
        yearRange: request.yearRange || ""
      }];
      // Keep old fields for backward compatibility
      brokerRequestData.vehicleMake = request.vehicleMake || "";
      brokerRequestData.vehicleModel = request.vehicleModel || "";
      brokerRequestData.yearRange = request.yearRange || "";
    }

    const [newRequest] = await db
      .insert(brokerRequests)
      .values(brokerRequestData)
      .returning();
    return newRequest;
  }

  // Contact inquiry methods
  async getAllContactInquiries(): Promise<ContactInquiry[]> {
    return await db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [newInquiry] = await db
      .insert(contactInquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  async deleteContactInquiry(id: string): Promise<boolean> {
    const result = await db.delete(contactInquiries).where(eq(contactInquiries.id, id));
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  // Vehicle inquiry methods
  async getAllVehicleInquiries(): Promise<VehicleInquiry[]> {
    return await db.select().from(vehicleInquiries).orderBy(desc(vehicleInquiries.createdAt));
  }

  async createVehicleInquiry(inquiry: InsertVehicleInquiry): Promise<VehicleInquiry> {
    const [newInquiry] = await db
      .insert(vehicleInquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }

  async deleteVehicleInquiry(id: string): Promise<boolean> {
    const result = await db.delete(vehicleInquiries).where(eq(vehicleInquiries.id, id));
    return result.rowCount !== undefined && result.rowCount > 0;
  }

  // Marketing source methods
  async getAllMarketingSources(): Promise<MarketingSource[]> {
    return await db.select().from(marketingSources).orderBy(desc(marketingSources.createdAt));
  }

  async createMarketingSource(source: InsertMarketingSource): Promise<MarketingSource> {
    const [newSource] = await db
      .insert(marketingSources)
      .values(source)
      .returning();
    return newSource;
  }

  async getMarketingSourceStats(): Promise<{ source: string; count: number; percentage: number }[]> {
    const allSources = await db.select().from(marketingSources);
    const totalCount = allSources.length;
    
    if (totalCount === 0) {
      return [];
    }

    const counts: { [key: string]: number } = {};
    allSources.forEach(source => {
      counts[source.source] = (counts[source.source] || 0) + 1;
    });

    return Object.entries(counts).map(([source, count]) => ({
      source,
      count,
      percentage: Math.round((count / totalCount) * 100)
    })).sort((a, b) => b.count - a.count);
  }
}

export const storage = new DatabaseStorage();
