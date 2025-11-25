CREATE TYPE "public"."websiteStatus" AS ENUM('Up', 'Down', 'Unkown');--> statement-breakpoint
CREATE TABLE "region" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "region_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ticks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ticks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"response_time" integer NOT NULL,
	"status" "websiteStatus",
	"regionId" integer,
	"websiteId" integer,
	"timeAdded" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" text NOT NULL,
	"password" text NOT NULL,
	"timeAdded" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "websites" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "websites_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"url" text NOT NULL,
	"timeAdded" timestamp with time zone DEFAULT now()
);
