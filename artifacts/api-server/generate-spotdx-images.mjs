import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const OUT_DIR = '../../artifacts/bluescrubs/public/spotdx-images';

const images = [
  {
    filename: 'inferior-stemi-ecg.png',
    prompt: 'Medical ECG tracing showing inferior STEMI with clear ST segment elevation in leads II, III, and aVF, with reciprocal ST depression in leads I and aVL, printed ECG paper with grid, hospital cardiology style, educational medical image, no patient identifiers',
  },
  {
    filename: 'pneumothorax-cxr.png',
    prompt: 'Chest X-ray radiograph showing right-sided pneumothorax with a clearly visible pleural line and absent lung markings beyond it, partial collapse of the right lung, realistic hospital PACS style radiology image, no patient identifiers, educational',
  },
  {
    filename: 'bells-palsy.png',
    prompt: 'Clinical photograph of a patient with left-sided facial nerve palsy (Bell palsy) showing drooping of the left side of the face, inability to close the left eye, loss of nasolabial fold on the left, and asymmetric smile, neutral background, medical educational photography, medium skin tone',
  },
  {
    filename: 'acute-angle-closure-glaucoma.png',
    prompt: 'Close-up clinical photograph of an eye showing acute angle closure glaucoma: red conjunctival injection, hazy steamy cornea, and a mid-dilated fixed pupil, realistic medical ophthalmology photography style, no text, educational',
  },
  {
    filename: 'meningococcal-rash.png',
    prompt: 'Clinical dermatology photograph of a non-blanching petechial and purpuric rash on the leg and lower torso of a young adult, dark red and purple spots that do not fade under pressure, realistic medical educational photography, medium skin tone, no text',
  },
  {
    filename: 'rheumatoid-hands.png',
    prompt: 'Clinical photograph of rheumatoid arthritis hands showing symmetrical swelling of metacarpophalangeal and proximal interphalangeal joints, ulnar deviation of fingers at the MCPJs, and swan-neck deformities bilaterally, realistic medical educational photography, light skin tone, no text',
  },
  {
    filename: 'graves-disease.png',
    prompt: 'Clinical photograph of a patient with Graves disease showing bilateral proptosis (exophthalmos), lid retraction, lid lag, and a smooth diffuse goitre of the neck, young adult female, realistic medical endocrinology photography, neutral background, light skin tone, no text',
  },
  {
    filename: 'kawasaki-disease.png',
    prompt: 'Clinical photograph of a young child with Kawasaki disease showing a bright red strawberry tongue with prominent papillae, bilateral conjunctival injection, and an erythematous polymorphous rash on the trunk, realistic medical paediatric educational photography, light skin tone, no text',
  },
  {
    filename: 'small-bowel-obstruction-axr.png',
    prompt: 'Abdominal X-ray showing small bowel obstruction with multiple centrally placed dilated loops of small intestine in a step-ladder pattern with visible valvulae conniventes, realistic hospital PACS radiology style, no patient identifiers, educational medical image',
  },
  {
    filename: 'atrial-fibrillation-ecg.png',
    prompt: 'Medical ECG tracing showing atrial fibrillation with completely irregular R-R intervals, absent P waves replaced by fibrillatory baseline, narrow QRS complexes at a ventricular rate of approximately 90 bpm, printed ECG paper with grid, hospital cardiology style, educational, no patient identifiers',
  },
];

async function generateImage(item) {
  const outPath = path.join(OUT_DIR, item.filename);
  if (fs.existsSync(outPath)) {
    console.log(`  SKIP (exists): ${item.filename}`);
    return true;
  }
  try {
    console.log(`  Generating: ${item.filename}…`);
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: item.prompt,
      size: '1024x1024',
      n: 1,
    });
    const buf = Buffer.from(response.data[0].b64_json, 'base64');
    fs.writeFileSync(outPath, buf);
    console.log(`  ✅ ${item.filename} (${Math.round(buf.length / 1024)}kb)`);
    return true;
  } catch (err) {
    console.error(`  ❌ ${item.filename}: ${err.message}`);
    return false;
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating ${images.length} spot diagnosis images…\n`);
  let ok = 0;
  for (let i = 0; i < images.length; i += 2) {
    const batch = images.slice(i, i + 2);
    const results = await Promise.all(batch.map(generateImage));
    ok += results.filter(Boolean).length;
    if (i + 2 < images.length) await new Promise(r => setTimeout(r, 800));
  }
  console.log(`\nDone: ${ok}/${images.length} images generated`);
}

main().catch(console.error);
