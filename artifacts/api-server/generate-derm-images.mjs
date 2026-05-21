import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const OUT_DIR = '../../artifacts/bluescrubs/public/derm-images';

const images = [
  {
    id: 'derm-plab-001',
    filename: 'psoriasis-plaque.png',
    prompt: 'Close-up clinical dermatology photograph of chronic plaque psoriasis on extensor elbows showing well-demarcated erythematous plaques with thick silvery-white scale, medium-brown skin tone, realistic medical educational photography, neutral clinical background, no text or labels',
  },
  {
    id: 'derm-plab-002',
    filename: 'atopic-eczema.png',
    prompt: 'Clinical dermatology photograph of atopic eczema in a young child showing lichenified excoriated red skin in the antecubital fossa, light skin tone, dry erythematous patches with scratch marks, realistic medical educational photography, neutral background, no text',
  },
  {
    id: 'derm-plab-003',
    filename: 'seborrhoeic-dermatitis.png',
    prompt: 'Clinical dermatology photograph of seborrhoeic dermatitis on the face of a young adult male showing yellowish greasy flaking scale on the nasolabial folds, eyebrows and along the hairline, mild erythema underneath, light skin tone, realistic medical educational photography, no text',
  },
  {
    id: 'derm-plab-004',
    filename: 'tinea-corporis.png',
    prompt: 'Clinical dermatology photograph of tinea corporis on the forearm showing a single annular erythematous ring with a raised scaly advancing edge and central clearing, light skin tone, clear ringworm lesion, realistic medical educational photography, neutral background, no text',
  },
  {
    id: 'derm-plab-005',
    filename: 'pityriasis-rosea.png',
    prompt: 'Clinical dermatology photograph of pityriasis rosea on the back of a young adult showing multiple oval salmon-pink patches with peripheral collarette scale arranged in a Christmas tree pattern along skin tension lines, medium skin tone, realistic medical educational photography, no text',
  },
  {
    id: 'derm-plab-006',
    filename: 'scabies-burrows.png',
    prompt: 'Macro close-up clinical dermatology photograph of scabies showing linear grey-white burrows and erythematous papules in the finger web spaces and on the wrist, dark brown skin tone, realistic medical educational photography, neutral background, no text',
  },
  {
    id: 'derm-plab-007',
    filename: 'herpes-zoster.png',
    prompt: 'Clinical dermatology photograph of herpes zoster shingles on the chest and flank of an elderly woman showing grouped clear vesicles on an erythematous base in a unilateral dermatomal band not crossing the midline, light skin tone, realistic medical educational photography, no text',
  },
  {
    id: 'derm-plab-008',
    filename: 'impetigo.png',
    prompt: 'Clinical dermatology photograph of impetigo in a young child showing golden honey-coloured crusted lesions around the nose and upper lip, light skin tone, crusts overlying erythematous skin, realistic medical educational photography, no text or labels',
  },
  {
    id: 'derm-plab-009',
    filename: 'urticaria.png',
    prompt: 'Clinical dermatology photograph of acute urticaria showing multiple raised erythematous wheals of varying sizes on the trunk and upper arms, medium skin tone, slightly raised irregular edges, realistic medical educational photography, neutral background, no text',
  },
  {
    id: 'derm-plab-010',
    filename: 'basal-cell-carcinoma.png',
    prompt: 'Close-up clinical dermatology photograph of nodular basal cell carcinoma on the nose of an elderly person showing a pearly translucent nodule with raised rolled edges, overlying telangiectasia, and central crusting, light skin tone, realistic medical educational photography, no text',
  },
];

async function generateImage(item) {
  const outPath = path.join(OUT_DIR, item.filename);
  if (fs.existsSync(outPath)) {
    console.log(`  SKIP (exists): ${item.filename}`);
    return item.filename;
  }
  try {
    console.log(`  Generating: ${item.filename}…`);
    const response = await openai.images.generate({
      model: 'gpt-image-1',
      prompt: item.prompt,
      size: '1024x1024',
      n: 1,
    });
    const b64 = response.data[0].b64_json;
    const buf = Buffer.from(b64, 'base64');
    fs.writeFileSync(outPath, buf);
    console.log(`  ✅ Saved: ${item.filename} (${Math.round(buf.length / 1024)}kb)`);
    return item.filename;
  } catch (err) {
    console.error(`  ❌ Failed: ${item.filename} — ${err.message}`);
    return null;
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  console.log(`Generating ${images.length} dermatology images…\n`);

  // Generate 2 at a time to avoid rate limits
  const results = [];
  for (let i = 0; i < images.length; i += 2) {
    const batch = images.slice(i, i + 2);
    const batchResults = await Promise.all(batch.map(generateImage));
    results.push(...batchResults);
    if (i + 2 < images.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  const succeeded = results.filter(Boolean);
  console.log(`\nDone: ${succeeded.length}/${images.length} images generated`);

  // Update the question bank with imageUrl fields
  const bankPath = './generated-question-bank.json';
  const bank = JSON.parse(fs.readFileSync(bankPath, 'utf8'));
  const qs = Array.isArray(bank) ? bank : bank.questions;

  const urlMap = Object.fromEntries(images.map(img => [img.id, `/derm-images/${img.filename}`]));
  let updated = 0;
  for (const q of qs) {
    if (urlMap[q.id] && !q.imageUrl) {
      q.imageUrl = urlMap[q.id];
      updated++;
    }
  }

  fs.writeFileSync(bankPath, JSON.stringify(qs, null, 2));
  console.log(`Updated ${updated} questions with imageUrl in question bank`);
}

main().catch(console.error);
