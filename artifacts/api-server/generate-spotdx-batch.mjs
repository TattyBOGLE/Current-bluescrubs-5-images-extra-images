import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const OUT_DIR = '../../artifacts/bluescrubs/public/spotdx-images';

const ALL_IMAGES = [
  {
    filename: 'otitis-externa.png',
    prompt: 'Medical otoscopy diagram showing otitis externa: cross-section illustration of the external auditory canal with diffuse red swollen walls, discharge, and oedema narrowing the canal lumen, educational medical ENT illustration style, clean white background, labelled anatomy, no text other than anatomical labels',
  },
  {
    filename: 'obstructive-jaundice-pancreatic-cancer.png',
    prompt: 'Clinical photograph of a middle-aged patient showing severe scleral icterus (intensely yellow whites of the eyes) and jaundiced facial skin, close-up portrait style, realistic medical clinical educational photography, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'cirrhosis-stigmata.png',
    prompt: 'Clinical medical education illustration showing the peripheral stigmata of chronic liver disease: composite image showing spider naevi on the chest, palmar erythema on the hands, and leukonychia (white nails), realistic clinical educational photography style, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'chickenpox.png',
    prompt: 'Clinical photograph of chickenpox varicella in a young child showing a widespread rash on the torso with lesions at multiple stages: red macules, small papules, clear fluid-filled vesicles, and some crusted lesions visible together, realistic medical paediatric educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'slapped-cheek-erythema-infectiosum.png',
    prompt: 'Clinical photograph of a young child with erythema infectiosum showing bright confluent red erythema on both cheeks resembling a slapped appearance, with sparing of the perioral area and forehead, and a faint lacy reticular rash on the upper arms, realistic medical paediatric educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'scarlet-fever.png',
    prompt: 'Clinical photograph showing a child with scarlet fever: fine sandpaper-textured erythematous rash covering the trunk and arms, with a close-up showing a bright red strawberry tongue with prominent red papillae, realistic medical paediatric infectious disease educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'croup-laryngotracheobronchitis.png',
    prompt: 'Paediatric AP neck and chest radiograph showing the classic steeple sign of croup — a symmetric subglottic narrowing below the glottis creating a tapered pencil-point or church steeple shape in the trachea, realistic hospital PACS radiology style, no patient identifiers, educational medical image',
  },
  {
    filename: 'pancoast-horner-syndrome.png',
    prompt: 'Clinical close-up photograph of a patient showing right-sided Horner syndrome with subtle right-sided ptosis (drooping upper eyelid) and right miosis (smaller right pupil) compared to the left side, realistic medical neurology educational photography, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'hyperkalaemia-ecg.png',
    prompt: 'Medical ECG tracing showing hyperkalaemia with tall peaked symmetrical narrow-based T waves in precordial leads, prolonged PR interval, and mildly widened QRS complexes at a rate of 72 bpm, printed on standard ECG grid paper, hospital cardiology style, educational, no patient identifiers',
  },
  {
    filename: 'pericarditis-ecg.png',
    prompt: 'Medical ECG tracing showing acute pericarditis: saddle-shaped concave-up ST elevation across multiple leads I, II, aVL, aVF, V2 through V6, with PR segment depression in leads II and V4 through V6, sinus rhythm at 85 bpm, printed on standard ECG grid paper, hospital cardiology educational style, no patient identifiers',
  },
  {
    filename: 'pleural-effusion-cxr.png',
    prompt: 'PA chest radiograph showing a moderate right-sided pleural effusion with a homogeneous opacity in the right lower and mid zones, a concave upward meniscus sign at the upper border, blunting of the right costophrenic angle, and subtle leftward mediastinal shift, realistic hospital PACS radiology style, no patient identifiers, educational',
  },
  {
    filename: 'pulmonary-embolism-ctpa.png',
    prompt: 'Axial CT pulmonary angiography image showing bilateral pulmonary emboli as low-attenuation filling defects within the right and left main pulmonary arteries and segmental branches, with the clot straddling the pulmonary artery bifurcation, realistic hospital PACS radiology style, no patient identifiers, educational medical image',
  },
  {
    filename: 'gout-foot.png',
    prompt: 'Clinical photograph of acute gout arthritis of the right foot showing intense erythema, marked swelling, and shiny taut overlying skin of the right first metatarsophalangeal joint (base of the big toe), realistic medical rheumatology educational photography, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'chlamydial-conjunctivitis.png',
    prompt: 'Clinical close-up photograph of chlamydial conjunctivitis in a young adult showing a red injected eye with mucopurulent yellowish discharge in the inner corner, mild conjunctival chemosis and papillary reaction on the inner eyelid, realistic medical ophthalmology educational photography, no text, no patient identifiers',
  },
  {
    filename: 'neuropathic-diabetic-ulcer.png',
    prompt: 'Clinical photograph of a neuropathic diabetic foot ulcer on the plantar sole over the first metatarsal head: a round punched-out ulcer with a callous hyperkeratotic rim, pink granulation tissue at the base, no surrounding cellulitis, on a warm plantar surface, realistic medical diabetic foot educational photography, medium skin tone, no text, no patient identifiers',
  },
];

const BATCH_START = parseInt(process.argv[2] || '0');
const BATCH_SIZE = parseInt(process.argv[3] || '5');
const batch = ALL_IMAGES.slice(BATCH_START, BATCH_START + BATCH_SIZE);

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
  console.log(`Batch ${BATCH_START}-${BATCH_START + BATCH_SIZE - 1}: generating ${batch.length} images…\n`);
  let ok = 0;
  for (let i = 0; i < batch.length; i += 2) {
    const chunk = batch.slice(i, i + 2);
    const results = await Promise.all(chunk.map(generateImage));
    ok += results.filter(Boolean).length;
    if (i + 2 < batch.length) await new Promise(r => setTimeout(r, 500));
  }
  console.log(`\nDone: ${ok}/${batch.length}`);
}

main().catch(console.error);
