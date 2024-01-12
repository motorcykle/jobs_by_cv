import puppeteer from "puppeteer";

export const getListings = async (link: string) => {
  // Launch Puppeteer browser
  const browser = await puppeteer.launch({
    headless: "new", // Set to true for headless mode
    defaultViewport: null,
  });

  // Create a new page
  const page = await browser.newPage();

  // Set viewport size (adjust values accordingly)
  await page.setViewport({ width: 1366, height: 768 });

  // Set a realistic User Agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');

  // Navigate to the target page
  await page.goto(link, {
    waitUntil: "domcontentloaded",
  });

  // Take a screenshot for debugging purposes
  // await page.screenshot({ path: 'screenshot.png' });

  // Introduce a delay to ensure page content is loaded
  await page.waitForTimeout(2000);

  // Extract data using page.evaluate
  const search = await page.evaluate(async () => {
    // Select and map elements to extract information
    const getAds = [...document.querySelectorAll(".css-5lfssm")].map(ad => {
      const title = [...ad.querySelectorAll(".jobTitle")].map((el: Partial<HTMLElement>) => el.innerText)[0];
      const coLocation = [...ad.querySelectorAll(".company_location")].map((el: Partial<HTMLElement>) => el.innerText)[0];
      const description = [...ad.querySelectorAll(".job-snippet")].map((el: Partial<HTMLElement>) => el.innerText)[0];
      const link = [...ad.querySelectorAll("a")].map((el: any) => el.href)[0];
      
      return {
        title,
        coLocation,
        description,
        link
      };
    });

    // Filter out entries with missing titles
    return getAds.filter(ad => ad?.title);
  });

  // Close the browser
  await browser.close();

  // Return the extracted data
  return search;
};