import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Admin users table for admin authentication
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(), // hashed password
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehicles = pgTable("vehicles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  mileage: integer("mileage").default(0),
  transmission: text("transmission").default(""),
  drivetrain: text("drivetrain").default(""),
  features: text("features").default(""),
  description: text("description").default(""),
  images: json("images").$type<string[]>().default([]),
  status: text("status").notNull().default("available"), // available, sold, pending
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brokerRequests = pgTable("broker_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  vehicleSelections: json("vehicle_selections").$type<Array<{make: string, model: string, yearRange: string}>>().notNull().default([]),
  maxBudget: text("max_budget").notNull(),
  mileageRange: text("mileage_range"),
  additionalRequirements: text("additional_requirements"),
  depositAgreed: text("deposit_agreed").notNull().default("true"),
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactInquiries = pgTable("contact_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, responded, closed
  createdAt: timestamp("created_at").defaultNow(),
});

export const vehicleInquiries = pgTable("vehicle_inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  vehicleId: varchar("vehicle_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message"),
  status: text("status").notNull().default("new"), // new, responded, closed
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketingSources = pgTable("marketing_sources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(), // facebook, google, instagram, sign, referral
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVehicleSchema = createInsertSchema(vehicles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBrokerRequestSchema = createInsertSchema(brokerRequests).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertContactInquirySchema = createInsertSchema(contactInquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertVehicleInquirySchema = createInsertSchema(vehicleInquiries).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
});

export const insertMarketingSourceSchema = createInsertSchema(marketingSources).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehicles.$inferSelect;

export type InsertBrokerRequest = z.infer<typeof insertBrokerRequestSchema>;
export type BrokerRequest = typeof brokerRequests.$inferSelect;

export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiries.$inferSelect;

export type InsertVehicleInquiry = z.infer<typeof insertVehicleInquirySchema>;
export type VehicleInquiry = typeof vehicleInquiries.$inferSelect;

export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type AdminUser = typeof adminUsers.$inferSelect;

export type InsertMarketingSource = z.infer<typeof insertMarketingSourceSchema>;
export type MarketingSource = typeof marketingSources.$inferSelect;
