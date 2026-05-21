import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  content: text("content").notNull(),
  options: jsonb("options"),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  examType: text("exam_type").notNull(),
  imageUrl: text("image_url"),
  tags: jsonb("tags"),
});

async function main() {
  console.log("Seeding 1 final spot diagnosis question…\n");

  await db.insert(questions).values({
    type: "mcq",
    category: "endocrinology",
    difficulty: "moderate",
    examType: "plab1",
    imageUrl: null,
    tags: ["spot-diagnosis", "endocrinology", "diabetic-foot"],
    content:
      "A 62-year-old man with a 15-year history of type 2 diabetes presents with a painless ulcer on the sole of his right foot over the first metatarsal head. The surrounding skin is warm with palpable foot pulses. He has reduced vibration sense and absent ankle reflexes bilaterally. What is the most likely type of ulcer?",
    options: [
      "Venous leg ulcer",
      "Arterial (ischaemic) ulcer",
      "Neuropathic diabetic ulcer",
      "Marjolin's ulcer",
      "Pyoderma gangrenosum",
    ],
    correctAnswer: "Neuropathic diabetic ulcer",
    explanation:
      "A neuropathic diabetic ulcer characteristically occurs at pressure points (e.g. metatarsal heads, heel), is painless (due to peripheral neuropathy), and occurs in the presence of intact pulses and warm skin. Reduced vibration sense and absent ankle reflexes confirm peripheral neuropathy. Arterial ulcers are painful, occur distally (toes, shin), and have absent pulses with cold, pale skin. PLAB pearl: diabetic foot ulcers are classified using the Wagner grading system. Multidisciplinary diabetic foot team involvement is essential. Offloading pressure with a total contact cast is the mainstay of treatment.",
  });

  console.log("  \u2713 endocrinology \u2014 Neuropathic diabetic ulcer");
  console.log("\nDone.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
