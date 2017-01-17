/*
 Navicat Premium Data Transfer

 Source Server         : docker_pg
 Source Server Type    : PostgreSQL
 Source Server Version : 90408
 Source Host           : localhost
 Source Database       : t1061
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 90408
 File Encoding         : utf-8

 Date: 01/17/2017 16:06:04 PM
*/

-- ----------------------------
--  Sequence structure for answers_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."answers_id_seq";
CREATE SEQUENCE "public"."answers_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;
ALTER TABLE "public"."answers_id_seq" OWNER TO "t1061";

-- ----------------------------
--  Sequence structure for groups_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."groups_id_seq";
CREATE SEQUENCE "public"."groups_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;
ALTER TABLE "public"."groups_id_seq" OWNER TO "t1061";

-- ----------------------------
--  Sequence structure for questions_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."questions_id_seq";
CREATE SEQUENCE "public"."questions_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;
ALTER TABLE "public"."questions_id_seq" OWNER TO "t1061";

-- ----------------------------
--  Sequence structure for similars_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."similars_id_seq";
CREATE SEQUENCE "public"."similars_id_seq" INCREMENT 1 START 1 MAXVALUE 9223372036854775807 MINVALUE 1 CACHE 1;
ALTER TABLE "public"."similars_id_seq" OWNER TO "t1061";

-- ----------------------------
--  Table structure for answers
-- ----------------------------
DROP TABLE IF EXISTS "public"."answers";
CREATE TABLE "public"."answers" (
	"id" int4 NOT NULL DEFAULT nextval('answers_id_seq'::regclass),
	"group_id" int4 NOT NULL,
	"question" varchar NOT NULL COLLATE "default",
	"answer" varchar NOT NULL COLLATE "default",
	"chlo2u_uuid" varchar NOT NULL COLLATE "default",
	"uuid" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."answers" OWNER TO "t1061";

-- ----------------------------
--  Table structure for groups
-- ----------------------------
DROP TABLE IF EXISTS "public"."groups";
CREATE TABLE "public"."groups" (
	"id" int4 NOT NULL DEFAULT nextval('groups_id_seq'::regclass),
	"name" varchar NOT NULL COLLATE "default",
	"url" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."groups" OWNER TO "t1061";

-- ----------------------------
--  Table structure for questions
-- ----------------------------
DROP TABLE IF EXISTS "public"."questions";
CREATE TABLE "public"."questions" (
	"id" int4 NOT NULL DEFAULT nextval('questions_id_seq'::regclass),
	"group_id" int4 NOT NULL,
	"question" varchar NOT NULL COLLATE "default",
	"descr" varchar COLLATE "default",
	"state" varchar NOT NULL COLLATE "default",
	"reply" varchar COLLATE "default",
	"user_uuid" varchar COLLATE "default",
	"created_at" timestamp(6) NULL,
	"replier_uuid" varchar COLLATE "default",
	"replied_at" timestamp(6) NULL,
	"uuid" varchar NOT NULL COLLATE "default"
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."questions" OWNER TO "t1061";

-- ----------------------------
--  Table structure for similars
-- ----------------------------
DROP TABLE IF EXISTS "public"."similars";
CREATE TABLE "public"."similars" (
	"id" int4 NOT NULL DEFAULT nextval('similars_id_seq'::regclass),
	"question_id" int4 NOT NULL,
	"answer_id" int4,
	"created_at" date
)
WITH (OIDS=FALSE);
ALTER TABLE "public"."similars" OWNER TO "t1061";


-- ----------------------------
--  Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."answers_id_seq" RESTART 1 OWNED BY "answers"."id";
ALTER SEQUENCE "public"."groups_id_seq" RESTART 1 OWNED BY "groups"."id";
ALTER SEQUENCE "public"."questions_id_seq" RESTART 1 OWNED BY "questions"."id";
ALTER SEQUENCE "public"."similars_id_seq" RESTART 1 OWNED BY "similars"."id";
-- ----------------------------
--  Primary key structure for table answers
-- ----------------------------
ALTER TABLE "public"."answers" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Uniques structure for table answers
-- ----------------------------
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_chlo2u_uuid_key" UNIQUE ("chlo2u_uuid") NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_uuid_key" UNIQUE ("uuid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table groups
-- ----------------------------
ALTER TABLE "public"."groups" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Uniques structure for table groups
-- ----------------------------
ALTER TABLE "public"."groups" ADD CONSTRAINT "groups_name_key" UNIQUE ("name") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table questions
-- ----------------------------
ALTER TABLE "public"."questions" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Uniques structure for table questions
-- ----------------------------
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_uuid_key" UNIQUE ("uuid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Primary key structure for table similars
-- ----------------------------
ALTER TABLE "public"."similars" ADD PRIMARY KEY ("id") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table answers
-- ----------------------------
ALTER TABLE "public"."answers" ADD CONSTRAINT "answers_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table questions
-- ----------------------------
ALTER TABLE "public"."questions" ADD CONSTRAINT "questions_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "public"."groups" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION NOT DEFERRABLE INITIALLY IMMEDIATE;

-- ----------------------------
--  Foreign keys structure for table similars
-- ----------------------------
ALTER TABLE "public"."similars" ADD CONSTRAINT "similars_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "public"."questions" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
ALTER TABLE "public"."similars" ADD CONSTRAINT "similars_answer_id_fkey" FOREIGN KEY ("answer_id") REFERENCES "public"."answers" ("id") ON UPDATE NO ACTION ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE;
