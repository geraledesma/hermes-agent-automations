#!/usr/bin/env node
// Hermes CEO — LinkedIn Saved Jobs Scraper
const { chromium } = require('playwright-core');
const fs = require('fs');

const SESSION_FILE = '/root/linkedin-playwright/session.json';
const SEEN_FILE = '/root/linkedin-playwright/seen-jobs.json';
const EXEC_PATH = require('child_process')
  .execSync('find /root/.cache/ms-playwright -name chrome-headless-shell -type f 2>/dev/null | head -1')
  .toString().trim();

function loadSeen() {
  try { return JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8')); }
  catch { return {}; }
}

function saveSeen(seen) {
  fs.writeFileSync(SEEN_FILE, JSON.stringify(seen, null, 2));
}

async function extractJobsFromPage(page) {
  return page.evaluate(() => {
    const jobs = [];
    // Use job view links as anchors — each link IS a job card entry
    const links = [...document.querySelectorAll('a[href*="/jobs/view/"]')];
    const seen = new Set();

    links.forEach(link => {
      const href = link.href.split('?')[0];
      const jobId = href.match(/\/jobs\/view\/(\d+)/)?.[1];
      if (!jobId || seen.has(jobId)) return;
      seen.add(jobId);

      const ariaLabel = link.getAttribute('aria-label') || '';
      // Walk up to find the card container
      let card = link.closest('li') || link.closest('[data-chameleon-result-urn]') || link.parentElement;

      const cardText = card ? card.innerText.split('\n').map(s => s.trim()).filter(Boolean) : [];

      // Title from aria-label or first substantial text in card
      const title = ariaLabel || cardText.find(t => t.length > 5 && !t.match(/^(Posted|Easy Apply|Be an early|Verified|Remote|Mexico|Hybrid|On-site|\d)/i)) || '';

      // Company: first line after title that looks like a company name
      const titleIdx = cardText.indexOf(title);
      const afterTitle = titleIdx >= 0 ? cardText.slice(titleIdx + 1) : cardText;
      const company = afterTitle.find(t => t.length > 2 && !t.match(/^(Posted|Easy Apply|Be an early|Verified|Remote|Mexico|Hybrid|On-site|CMX|\d)/i)) || '';
      const location = afterTitle.find(t => t.match(/Remote|Mexico|Hybrid|On-site|CMX/i)) || '';

      jobs.push({ jobId, title, company, location, url: href });
    });

    return jobs;
  });
}

async function clickNextPage(page) {
  try {
    // Try clicking the next numbered page button
    const current = await page.$('.artdeco-pagination__indicator--number.active button, [aria-current="true"]');
    const currentNum = current ? parseInt(await current.textContent()) : 1;
    const nextBtn = await page.$(`button[aria-label="Page ${currentNum + 1}"]`);
    if (!nextBtn) return false;
    await nextBtn.click();
    await page.waitForTimeout(3000);
    return true;
  } catch {
    return false;
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: EXEC_PATH });
  const ctx = await browser.newContext({
    storageState: SESSION_FILE,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  });
  const page = await ctx.newPage();

  await page.goto('https://www.linkedin.com/my-items/saved-jobs/', {
    waitUntil: 'load',
    timeout: 40000
  });

  // Wait for job links to appear
  try {
    await page.waitForSelector('a[href*="/jobs/view/"]', { timeout: 15000 });
  } catch {
    console.error('No job links found after 15s — may be empty or auth failed');
    await browser.close();
    process.exit(0);
  }
  await page.waitForTimeout(1500);

  const allJobs = [];
  let pageNum = 1;

  while (pageNum <= 10) {
    const jobs = await extractJobsFromPage(page);
    allJobs.push(...jobs);
    const hasNext = await clickNextPage(page);
    if (!hasNext) break;
    pageNum++;
  }

  // Deduplicate by jobId
  const seenIds = new Set();
  const uniqueJobs = allJobs.filter(j => {
    if (seenIds.has(j.jobId)) return false;
    seenIds.add(j.jobId);
    return true;
  });

  await browser.close();

  const seenData = loadSeen();
  const now = new Date().toISOString();
  const newJobs = [];

  for (const job of uniqueJobs) {
    if (!seenData[job.jobId]) {
      seenData[job.jobId] = { firstSeen: now, ...job };
      newJobs.push(job);
    }
  }

  saveSeen(seenData);

  console.log(JSON.stringify({
    runAt: now,
    totalFound: uniqueJobs.length,
    newJobs: newJobs.length,
    allJobs: uniqueJobs,
    newJobsList: newJobs
  }, null, 2));
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
