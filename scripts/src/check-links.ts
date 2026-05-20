import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');

interface LinkResult {
  url: string;
  status: number | 'timeout' | 'error';
  ok: boolean;
  redirectTo?: string;
  autoFixed?: string;
}

interface BrokenLink {
  questionId: string;
  questionTitle: string;
  url: string;
  status: number | 'timeout' | 'error';
}

interface Report {
  checkedAt: string;
  totalChecked: number;
  totalPassing: number;
  totalBroken: number;
  redirected: { url: string; to: string }[];
  broken: BrokenLink[];
  autoFixes: { original: string; fixed: string }[];
}

// Extract all reference URLs from a question object
function extractUrlsFromQuestion(q: any): string[] {
  const urls: string[] = [];
  const add = (u: unknown) => {
    if (typeof u === 'string' && u.startsWith('http')) urls.push(u);
  };

  // Direct url fields
  add(q.url);
  add(q.reference_url);
  add(q.cks_url);

  // Structured guidance blocks
  for (const key of ['cks_guidance', 'esc_guidance', 'ada_guidance', 'sign_guidance', 'bts_guidance']) {
    const block = q[key];
    if (block && typeof block === 'object') {
      add(block.url);
      add(block.cks_url);
      add(block.esc_url);
      add(block.ada_url);
      add(block.sign_url);
      add(block.bts_url);
      if (Array.isArray(block.specific_references)) {
        for (const r of block.specific_references) add(r?.url);
      }
    }
  }

  // References array
  if (Array.isArray(q.references)) {
    for (const r of q.references) {
      add(typeof r === 'string' ? r : r?.url);
    }
  }

  return [...new Set(urls.filter(Boolean))];
}

// Auto-fix known broken URL patterns
function autoFixUrl(url: string): string | null {
  // treatment-summaries/condition → CKS equivalent
  const treatmentMatch = url.match(/bnf\.nice\.org\.uk\/treatment-summaries\/([^/?#]+)/);
  if (treatmentMatch) {
    const slug = treatmentMatch[1];
    return `https://cks.nice.org.uk/topics/${slug}/`;
  }
  return null;
}

// Check a single URL with HEAD request
async function checkUrl(url: string, timeoutMs = 10000): Promise<LinkResult> {
  const fixed = autoFixUrl(url);
  const checkTarget = fixed ?? url;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const resp = await fetch(checkTarget, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'User-Agent': 'BlueScrubsPrep/1.0 link-checker' },
    });
    clearTimeout(timer);

    const result: LinkResult = {
      url,
      status: resp.status,
      ok: resp.status >= 200 && resp.status < 400,
    };
    if (fixed) result.autoFixed = fixed;
    if (resp.redirected) result.redirectTo = resp.url;
    return result;
  } catch (e: any) {
    return {
      url,
      status: e?.name === 'AbortError' ? 'timeout' : 'error',
      ok: false,
      ...(fixed ? { autoFixed: fixed } : {}),
    };
  }
}

// Run checks in batches
async function checkBatch(urls: string[], batchSize = 5, delayMs = 1000): Promise<Map<string, LinkResult>> {
  const results = new Map<string, LinkResult>();
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const settled = await Promise.all(batch.map(u => checkUrl(u)));
    for (const r of settled) results.set(r.url, r);
    if (i + batchSize < urls.length) {
      await new Promise(res => setTimeout(res, delayMs));
    }
    const done = Math.min(i + batchSize, urls.length);
    process.stdout.write(`\r  Checked ${done}/${urls.length} URLs...`);
  }
  process.stdout.write('\n');
  return results;
}

async function main() {
  console.log('\n📋 BlueScrubs Link Checker\n');

  // Load question bank
  const bankPath = resolve(ROOT, 'artifacts', 'api-server', 'generated-question-bank.json');
  if (!existsSync(bankPath)) {
    console.error('❌ Question bank not found at', bankPath);
    process.exit(1);
  }

  let questions: any[] = [];
  try {
    const raw = readFileSync(bankPath, 'utf-8');
    const data = JSON.parse(raw);
    questions = Array.isArray(data) ? data : (data.questions ?? []);
    console.log(`✅ Loaded ${questions.length} questions from bank\n`);
  } catch {
    console.error('❌ Failed to parse question bank');
    process.exit(1);
  }

  // Collect all unique URLs with their question context
  const urlToQuestions = new Map<string, { id: string; title: string }[]>();
  for (const q of questions) {
    const urls = extractUrlsFromQuestion(q);
    const ctx = { id: String(q.id ?? 'unknown'), title: String(q.question ?? q.stem ?? '').slice(0, 80) };
    for (const url of urls) {
      if (!urlToQuestions.has(url)) urlToQuestions.set(url, []);
      urlToQuestions.get(url)!.push(ctx);
    }
  }

  const allUrls = [...urlToQuestions.keys()];
  console.log(`🔗 Found ${allUrls.length} unique reference URLs to check\n`);

  if (allUrls.length === 0) {
    console.log('ℹ️  No URLs found in question bank. Nothing to check.');
    return;
  }

  // Run checks
  console.log('🔍 Running link checks (batch of 5, 1s delay between batches)...');
  const results = await checkBatch(allUrls);

  // Build report
  const report: Report = {
    checkedAt: new Date().toISOString(),
    totalChecked: results.size,
    totalPassing: 0,
    totalBroken: 0,
    redirected: [],
    broken: [],
    autoFixes: [],
  };

  for (const [url, result] of results) {
    if (result.ok) {
      report.totalPassing++;
    } else {
      report.totalBroken++;
      const contexts = urlToQuestions.get(url) ?? [];
      for (const ctx of contexts) {
        report.broken.push({
          questionId: ctx.id,
          questionTitle: ctx.title,
          url,
          status: result.status,
        });
      }
    }
    if (result.redirectTo && result.redirectTo !== url) {
      report.redirected.push({ url, to: result.redirectTo });
    }
    if (result.autoFixed) {
      report.autoFixes.push({ original: url, fixed: result.autoFixed });
    }
  }

  // Write report
  const reportPath = resolve(ROOT, 'link-report.json');
  writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  // Print summary
  console.log('\n═══════════════════════════════════');
  console.log(`📊 Link Check Report — ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════');
  console.log(`  Total checked : ${report.totalChecked}`);
  console.log(`  ✅ Passing     : ${report.totalPassing}`);
  console.log(`  ❌ Broken      : ${report.totalBroken}`);
  console.log(`  ↪  Redirected  : ${report.redirected.length}`);
  console.log(`  🔧 Auto-fixed  : ${report.autoFixes.length}`);
  console.log('═══════════════════════════════════\n');

  if (report.broken.length > 0) {
    console.log('❌ Broken links:');
    const seen = new Set<string>();
    for (const b of report.broken) {
      if (seen.has(b.url)) continue;
      seen.add(b.url);
      console.log(`   [${b.status}] ${b.url}`);
      console.log(`         └─ Q${b.questionId}: ${b.questionTitle}`);
    }
  }

  if (report.autoFixes.length > 0) {
    console.log('\n🔧 Auto-fixes applied (treatment-summaries → CKS):');
    for (const f of report.autoFixes) {
      console.log(`   ${f.original}`);
      console.log(`   → ${f.fixed}`);
    }
  }

  if (report.autoFixes.length > 0) {
    console.log('\n💡 Tip: Apply auto-fixes to the question bank by running:');
    console.log('   pnpm --filter @workspace/scripts run fix-links\n');
  }

  console.log(`\n📄 Full report saved to: ${reportPath}\n`);
  process.exit(report.totalBroken > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
