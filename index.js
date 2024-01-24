const puppeteer = require("puppeteer");
const fs = require("fs/promises");

const run = async () => {
 const browser = await puppeteer.launch({
  headless: true,
 });
 const page = await browser.newPage();

 await page.goto("https://learnwebcode.github.io/practice-requests/", {
  waitUntil: "load",
  timeout: 0,
 });

 const names = await page.evaluate(() => {
  return Array.from(
   document.querySelectorAll(".animal-cards .card .info strong")
  ).map((el) => el.innerHTML);
 });

 await fs.writeFile("name.txt", names.join("\r\n"));

 await page.click("#clickme");

 const clickedData = await page.$eval("#data", (data) => data.textContent);

 console.log("-----------------");
 console.log(clickedData);
 console.log("-----------------");

 const photos = await page.$$eval("img", (imgs) => {
  return imgs.map((img) => img.src);
 });

 await page.type("#ourform input", "blue", { delay: 100 });

 await Promise.all([page.click("#ourform button"), page.waitForNavigation()]);

 const message = await page.$eval("#message", (el) => el.textContent);

 console.log("-----------------");
 console.log(message);
 console.log("-----------------");

 for (const photo of photos) {
  const imagePage = await page.goto(photo);
  await fs.writeFile(photo.split("/").pop(), await imagePage.buffer());
 }

 await fs.writeFile("paths.txt", photos.join("\r\n"));

 //  await page.screenshot({ path: "example.png", fullPage: true });

 await browser.close();
};

run();
