import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  jsonb,
  timestamp,
} from "drizzle-orm/pg-core";

/* =========================
   CANDIDATE
========================= */
export const candidatesTable = pgTable("candidates", {
  id: serial("id").primaryKey(),

  fullName: varchar("full_name", { length: 255 }),
  email: varchar("email", { length: 255 }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/* =========================
   RESUME
========================= */
export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),

  candidateId: integer("candidate_id")
    .notNull()
    .references(() => candidatesTable.id, { onDelete: "cascade" }),

  fileName: varchar("file_name", { length: 255 }).notNull(),
  extractedText: text("extracted_text").notNull(),

  uploadedAt: timestamp("uploaded_at").defaultNow().notNull(),
});

/* =========================
   RESUME AI ANALYSIS
========================= */
export const resumeAnalysisTable = pgTable("resume_analysis", {
  id: serial("id").primaryKey(),

  resumeId: integer("resume_id")
    .notNull()
    .references(() => resumesTable.id, { onDelete: "cascade" }),

  summary: text("summary").notNull(),

  skills: jsonb("skills").$type<string[]>().notNull(),
  experienceYears: integer("experience_years"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
