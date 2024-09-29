// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
  
//   // Replace with the URL of the forum
//   await page.goto('https://nulled.to');

//   // Function to extract data from a category
//   const extractCategoryData = async (categorySelector) => {
//     return await page.evaluate((selector) => {
//       const category = document.querySelector(selector);
//       const channels = Array.from(category.querySelectorAll('li')).map(channel => channel.innerText);
//       return channels;
//     }, categorySelector);
//   };

//   // Define the selectors for each category
//   const categories = {
//     "Home": "#home-category-selector",
//     "Cracking": "#cracking-category-selector",
//     "Hacking": "#hacking-category-selector",
//     "Leaks": "#leaks-category-selector",
//     "MarketPlace": "#marketplace-category-selector",
//     "Premium": "#premium-category-selector",
//     "Money": "#money-category-selector",
//     "Crypto": "#crypto-category-selector",
//     "Memes": "#memes-category-selector"
//   };

//   // Object to store the results
//   const results = {};

//   // Loop through each category and extract data
//   for (const [category, selector] of Object.entries(categories)) {
//     results[category] = await extractCategoryData(selector);
//   }

//   console.log(JSON.stringify(results, null, 2));

//   await browser.close();
// })();
