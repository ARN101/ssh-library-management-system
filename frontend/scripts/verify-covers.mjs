/**
 * Headless check: register student, open catalog, count loaded cover images.
 */
import { chromium } from "playwright";

const FE = process.env.FE_URL || "http://localhost:5173";
const stamp = Date.now();
const email = `c${stamp}@stud.kuet.ac.bd`;
const password = "test1234";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

const coverHits = [];
page.on("response", (res) => {
  if (res.url().includes("/covers/")) {
    coverHits.push({
      url: res.url(),
      status: res.status(),
      type: res.headers()["content-type"] || "",
    });
  }
});

try {
  await page.goto(`${FE}/register`, { waitUntil: "networkidle" });
  await page.getByPlaceholder("Your full name").fill("Cover Tester");
  await page.getByPlaceholder("name@stud.kuet.ac.bd").fill(email);
  await page.getByPlaceholder("At least 6 characters").fill(password);
  await page.getByRole("button", { name: "Register" }).click();
  await page.waitForURL("**/login**", { timeout: 15000 });

  await page.getByPlaceholder("name@stud.kuet.ac.bd").fill(email);
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Login" }).click();
  await page.waitForURL("**/student/**", { timeout: 15000 });

  await page.goto(`${FE}/student/book-catalog`, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="book-cover"] img', {
    timeout: 20000,
  });
  await page.waitForTimeout(3000);

  const stats = await page.evaluate(() => {
    const wraps = [...document.querySelectorAll('[data-testid="book-cover"]')];
    const imgs = wraps.map((w) => w.querySelector("img")).filter(Boolean);
    const loaded = imgs.filter((img) => img.complete && img.naturalWidth > 20);
    const sample = imgs.slice(0, 5).map((img) => ({
      src: img.currentSrc || img.src,
      w: img.naturalWidth,
      h: img.naturalHeight,
    }));
    return {
      coverSlots: wraps.length,
      imgTags: imgs.length,
      loadedOk: loaded.length,
      sample,
    };
  });

  const out = "/tmp/ssh-catalog-covers.png";
  await page.screenshot({ path: out, fullPage: false });

  console.log(
    JSON.stringify(
      { email, stats, coverHits: coverHits.slice(0, 10), screenshot: out },
      null,
      2
    )
  );

  if (stats.loadedOk < 5) {
    console.error("FAIL: fewer than 5 covers loaded");
    process.exit(1);
  }
  console.log("PASS: covers visible in catalog");
} catch (err) {
  await page.screenshot({ path: "/tmp/ssh-catalog-fail.png" }).catch(() => {});
  console.error("ERROR", err.message);
  console.error("url", page.url());
  process.exit(1);
} finally {
  await browser.close();
}
