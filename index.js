
const fs = require("fs");
const puppeteer = require("puppeteer");
// read csv file
const data = fs.readFileSync("./social_links.csv", "utf8");
const rows = data.split(/\r?\n/);
console.log("reading done");
function writeCSV(arr) {
  const arrayData = [...arr];
  //output file
  const writeStream = fs.createWriteStream("file.csv", {
    flags: "a",
    encoding: null,
    mode: 0666,
  });
  writeStream.write(arrayData.join(","));
  writeStream.write("," + "\n");
}


const Scrapping = async (url) => {
  console.log("Wait for Result....");
  const browser = await puppeteer.launch();
  const csvData = [];
  const page = await browser.newPage();
  let singleLink;
  for (let link of url) {
    singleLink = link;
    const rowData = {
      url: singleLink,
      shopify: "No",
      klaviyo: "No",
    };
    let status = await page.goto(link, { timeout: 0 });
    status = status.status();
    if (status != 404) {
      console.log(`Probably HTTP response status code 200 OK.`);
    }
    const scriptTags = await page.$$eval("script", (scriptTags) =>
      scriptTags.map((scriptTag) => scriptTag.src)
    );
    scriptTags.forEach((src) => {
      if (src && src.includes("shopify")) {
        rowData.shopify = "Yes";
      }
      if (src && src.includes("klaviyo")) {
        rowData.klaviyo = "Yes";
      }
    });
    csvData.push(rowData);
  }
  csvData.forEach((data) => {
    writeCSV([data.url, data.shopify, data.klaviyo]);
  });
//   console.log(csvData);
  await browser.close();
};
// Calls the main function
Scrapping(rows);
