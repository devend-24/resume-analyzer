CREATE TABLE "candidates" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255),
	"email" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resume_analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer NOT NULL,
	"summary" text NOT NULL,
	"skills" jsonb NOT NULL,
	"experience_years" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" serial PRIMARY KEY NOT NULL,
	"candidate_id" integer NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"extracted_text" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "resume_analysis" ADD CONSTRAINT "resume_analysis_resume_id_resumes_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."resumes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_candidate_id_candidates_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."candidates"("id") ON DELETE cascade ON UPDATE no action;