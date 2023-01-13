const fs = require("fs");
const puppeteer = require('puppeteer')
const cheerio = require('cheerio');
const express = require('express');
const json2csv = require('json2csv').parse;



// read csv file 
const data = fs.readFileSync('./social_links.csv', 'utf8');
const rows = data.split(/\r?\n/); 
console.log("reading done");

 
const fields = ['URL', 'SHOPIFY', 'KLAVIYO']



const Scrapping = async(url)=>{ 
console.log('Wait for Result....');
const browser = await puppeteer.launch();
const csvData = []
const page = await browser.newPage();  
   let singleLink;
   for( let link of url) { 
       singleLink = link;
       const rowData = {
            url: singleLink, 
            shopify: "No",
            klaviyo: "No"
        }

      let status =  await page.goto(link,{timeout: 0}); 
        status = status.status();
         if (status != 404) {
          console.log(`Probably HTTP response status code 200 OK.`);
        };

        const scriptTags = await page.$$eval('script', scriptTags => scriptTags.map(scriptTag => scriptTag.src));
        scriptTags.forEach(src => {
            
            if(src && (src.includes('shopify'))) { 
                rowData.shopify = "Yes"
               
            }
            if(src && (src.includes('klaviyo'))){
                rowData.klaviyo = "Yes"
            }
            
        });
        csvData.push(rowData)
    } 

    console.log(csvData);

   // write the data in the file 
   const csv = json2csv(csvData, { fields });
   fs.writeFile('file.csv', csv, function(err) {
    if (err) throw err;
    console.log('file saved');
    });

    await browser.close();
}

   // Call  function 
   Scrapping(rows);







//  const port  = 5000;

// const app = express(); 




// app.get('/',(req,res)=>{

//         let url = 'http://www.instagram.com';

//         request(url , (error,response, html)=>{
           
//             if(!error){
//                 // console.log(html);
//                 var $ = cheerio.load(html); 
//                 var title = $("").attr('src');
//                 console.log(title)
//             }
//         }) 

//         res.send("<h1>Hello </h1>")
// })


// app.listen(port, ()=>{
//     console.log('Server is running ' , port);
// })