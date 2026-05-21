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
    filename: 'psoriasis.png',
    prompt: 'Clinical dermatology photograph of plaque psoriasis showing well-demarcated erythematous plaques with thick silvery-white scales on the elbows and forearms of an adult, realistic medical dermatology educational photography, medium skin tone, neutral background, no text, no patient identifiers',
  },
  {
    filename: 'atopic-eczema.png',
    prompt: 'Clinical photograph of atopic eczema in a young child showing red, inflamed, weeping, excoriated patches in the antecubital fossa (inside of elbow), with lichenification and scratch marks, realistic medical dermatology educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'melanoma.png',
    prompt: 'Clinical dermatoscopy-style photograph of a malignant melanoma lesion on the upper back of an adult, showing marked asymmetry, irregular jagged borders, multiple colours including dark brown, black, and pink areas, diameter approximately 10mm, realistic medical dermatology educational image, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'herpes-zoster-shingles.png',
    prompt: 'Clinical photograph of herpes zoster (shingles) showing a unilateral dermatomal band of clustered vesicles on an erythematous base on the left mid-thoracic trunk, following one dermatome, some vesicles crusting over, realistic medical dermatology educational photography, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'otitis-externa.png',
    prompt: 'Clinical otoscope view photograph of the right ear canal showing otitis externa with diffuse erythema, oedema and swelling of the external auditory canal walls, with mucopurulent discharge visible, realistic medical otolaryngology educational image, no text, no patient identifiers',
  },
  {
    filename: 'peritonsillar-abscess-quinsy.png',
    prompt: 'Clinical oral photograph showing a left peritonsillar abscess (quinsy) with marked unilateral peritonsillar swelling, bulging of the left soft palate, uvular deviation to the right, erythematous mucosa, and a tense fluctuant bulge above the left tonsil, realistic medical ENT educational photography, no text, no patient identifiers',
  },
  {
    filename: 'obstructive-jaundice-pancreatic-cancer.png',
    prompt: 'Clinical photograph of a middle-aged adult with obstructive jaundice showing deep yellow scleral icterus (yellow whites of the eyes) and jaundiced skin, with a clinical examination scene showing a palpable non-tender right upper quadrant mass (Courvoisier sign), realistic medical clinical educational photography, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'cirrhosis-stigmata.png',
    prompt: 'Clinical composite photograph showing stigmata of chronic liver disease in an adult male: spider naevi on the chest and arms, palmar erythema on both hands, and gynaecomastia, with a distended abdomen showing caput medusae (dilated periumbilical veins), realistic medical hepatology educational photography, no text, no patient identifiers',
  },
  {
    filename: 'chickenpox.png',
    prompt: 'Clinical photograph of chickenpox in a young child showing widespread vesicular rash at multiple stages: red macules, papules, and clear fluid-filled vesicles ("dewdrops on a rose petal") alongside crusted lesions, distributed over the trunk, face, and scalp, realistic medical paediatric educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'slapped-cheek-erythema-infectiosum.png',
    prompt: 'Clinical photograph of erythema infectiosum (fifth disease, slapped cheek syndrome) in a young child showing bright red confluent erythema on both cheeks giving a slapped appearance, with sparing of the perioral region, and a lacy reticular pink rash beginning to appear on the upper arms, realistic medical paediatric educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'scarlet-fever.png',
    prompt: 'Clinical photograph showing scarlet fever in a child with a widespread fine sandpaper-textured erythematous rash on the trunk and arms, close-up inset showing strawberry tongue with red papillae and white coating, circumoral pallor, realistic medical paediatric infectious disease educational photography, light skin tone, no text, no patient identifiers',
  },
  {
    filename: 'croup-laryngotracheobronchitis.png',
    prompt: 'Paediatric chest and neck X-ray (AP view) showing the classic "steeple sign" (subglottic narrowing) of croup — a tapered narrowing of the trachea below the glottis, giving a church steeple appearance on AP cervical and chest radiograph, realistic medical paediatric radiology educational image, no text, no patient identifiers',
  },
  {
    filename: 'pancoast-horner-syndrome.png',
    prompt: 'Clinical composite educational photograph showing right-sided Horner syndrome (ptosis, miosis, anhidrosis of the right side of the face) alongside an apical chest X-ray showing a right upper lobe apical opacity consistent with a Pancoast tumour, realistic medical educational photography and radiology, no text, no patient identifiers',
  },
  {
    filename: 'hyperkalaemia-ecg.png',
    prompt: 'Medical ECG tracing showing severe hyperkalaemia with tall peaked narrow T waves, prolonged PR interval, widened QRS complexes approaching a sine wave pattern, at a rate of 75 bpm, printed on ECG grid paper, hospital cardiology style, educational medical image, no patient identifiers',
  },
  {
    filename: 'pericarditis-ecg.png',
    prompt: 'Medical ECG tracing showing acute pericarditis with widespread saddle-shaped (concave up) ST elevation across multiple leads including I, II, aVF, and V2-V6, PR segment depression in lead II, normal QRS complexes, sinus rhythm, printed on ECG grid paper, hospital cardiology style, educational, no patient identifiers',
  },
  {
    filename: 'pleural-effusion-cxr.png',
    prompt: 'Chest X-ray radiograph showing a large right-sided pleural effusion with complete opacification of the right lower zone, a concave meniscus sign at the upper border of the opacity, blunting of the right costophrenic angle, and mild mediastinal shift to the left, realistic hospital PACS radiology style, no patient identifiers, educational',
  },
  {
    filename: 'pulmonary-embolism-ctpa.png',
    prompt: 'CT pulmonary angiography (CTPA) axial slice showing bilateral pulmonary emboli as filling defects (low-density clots) within the right and left main pulmonary arteries and lobar branches, with a saddle embolus straddling the main pulmonary artery bifurcation, realistic hospital radiology PACS style image, no patient identifiers, educational',
  },
  {
    filename: 'gout-foot.png',
    prompt: 'Clinical photograph of acute gout affecting the right first metatarsophalangeal joint (big toe) showing marked erythema, swelling, and shiny overlying skin of the first MTP joint, the toe is held in extension, patient is unable to bear weight, realistic medical rheumatology educational photography, medium skin tone, no text, no patient identifiers',
  },
  {
    filename: 'chlamydial-conjunctivitis.png',
    prompt: 'Clinical close-up photograph of chlamydial conjunctivitis in a young adult showing unilateral red eye with mucopurulent discharge, conjunctival injection and chemosis, mild eyelid oedema, with a papillary reaction visible on the palpebral conjunctiva, realistic medical ophthalmology educational photography, no text, no patient identifiers',
  },
  {
    filename: 'neuropathic-diabetic-ulcer.png',
    prompt: 'Clinical photograph of a neuropathic diabetic foot ulcer on the plantar surface of the right foot over the first metatarsal head — a well-defined punched-out ulcer with a callous rim, pink granulation tissue base, no surrounding erythema, on a warm foot with visible foot pulses, realistic medical diabetology educational photography, medium skin tone, no text, no patient identifiers',
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
