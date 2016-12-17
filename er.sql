/* SQLEditor (Postgres)*/

CREATE TABLE groups
(
id SERIAL NOT NULL,
name CHAR NOT NULL UNIQUE ,
url CHAR NOT NULL,
CONSTRAINT "groups_pkey" PRIMARY KEY (id)
);

CREATE TABLE answers
(
id SERIAL NOT NULL,
"group_id" INTEGER NOT NULL,
question VARCHAR NOT NULL,
answer VARCHAR NOT NULL,
"chlo2u_uuid" CHAR NOT NULL UNIQUE ,
CONSTRAINT "answers_pkey" PRIMARY KEY (id)
);

CREATE TABLE questions
(
id SERIAL NOT NULL,
"group_id" INTEGER NOT NULL,
question VARCHAR NOT NULL,
descr VARCHAR,
state CHAR NOT NULL,
reply VARCHAR,
"user_uuid" CHAR,
"created_at" DATE,
"replier_uuid" CHAR,
"replied_at" DATE,
CONSTRAINT "questions_pkey" PRIMARY KEY (id)
);

CREATE TABLE similars
(
id SERIAL NOT NULL,
"question_id" INTEGER NOT NULL,
"answer_id" INTEGER,
"created_at" DATE,
CONSTRAINT "similars_pkey" PRIMARY KEY (id)
);

ALTER TABLE answers ADD CONSTRAINT "group_question" UNIQUE ("group_id",question);

ALTER TABLE answers ADD FOREIGN KEY ("group_id") REFERENCES groups (id) ON DELETE NO ACTION;

ALTER TABLE questions ADD FOREIGN KEY ("group_id") REFERENCES groups (id) ON DELETE NO ACTION;

ALTER TABLE similars ADD FOREIGN KEY ("question_id") REFERENCES questions (id) ON DELETE CASCADE;

ALTER TABLE similars ADD FOREIGN KEY ("answer_id") REFERENCES answers (id) ON DELETE CASCADE;