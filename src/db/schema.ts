import { pgTable, text, timestamp, varchar, integer, serial, boolean, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 50 }).notNull().default("admin"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sermons = pgTable("sermons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  speaker: varchar("speaker", { length: 255 }).notNull(),
  date: timestamp("date").notNull(),
  videoUrl: text("video_url"),
  audioUrl: text("audio_url"),
  coverUrl: text("cover_url"),
  category: varchar("category", { length: 100 }),
  seriesId: uuid("series_id"),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location", { length: 255 }),
  bannerUrl: text("banner_url"),
  category: varchar("category", { length: 100 }),
  registrationOpen: boolean("registration_open").default(false),
  maxAttendees: integer("max_attendees"),
  isPublished: boolean("is_published").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const testimonials = pgTable("testimonials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  videoUrl: text("video_url"),
  isApproved: boolean("is_approved").default(false),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ministries = pgTable("ministries", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  leadName: varchar("lead_name", { length: 255 }),
  leadEmail: varchar("lead_email", { length: 255 }),
  imageUrl: text("image_url"),
  icon: varchar("icon", { length: 50 }),
  order: integer("order"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const prayerRequests = pgTable("prayer_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  request: text("request").notNull(),
  isPrivate: boolean("is_private").default(false),
  isRead: boolean("is_read").default(false),
  isPrayed: boolean("is_prayed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  isActive: boolean("is_active").default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const liveStreamSettings = pgTable("live_stream_settings", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 50 }).notNull(),
  embedUrl: text("embed_url"),
  videoId: text("video_id"),
  isLive: boolean("is_live").default(false),
  scheduledAt: timestamp("scheduled_at"),
  title: varchar("title", { length: 255 }),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
