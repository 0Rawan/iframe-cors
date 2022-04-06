const replace = require('absolutify')
const express = require('express')
const fs = require('fs');
const puppeteer = require('puppeteer')


const app = express()

app.get('/', async (req, res) => {
    const url = 'trendyol.com'
    
    if (!url) {
        return res.send('Not url provided')
    } else {
        // generate puppeteer screenshot 
        try {
            // If headless Chrome is not launching on Debian, use the following line instead
            // const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
            const browser = await puppeteer.launch({
            	headless: true,
    		devtools: true,
    		args: [
        	'--disable-web-security',
        	'--disable-features=IsolateOrigins',
        	'--disable-site-isolation-trials',
		'--disable-setuid-sandbox',
		'--no-sandbox'	
    		]
	});
           
           
            const page = await browser.newPage()
            const cookies = JSON.parse(fs.readFileSync("cookies.json", 'utf-8'));
	   for (const cookie of cookies) {
  		await page.setCookie(cookie);
		}
            await page.goto(`https://${url}`){
	    	waitUntil : 'networkidle2'
	    }
            
            let document = await page.evaluate(() => document.documentElement.outerHTML)
            document = replace(document, `/?url=${url.split('/')[0]}`)
            
            return res.send(document)
        } catch(err) {
            console.log(err)
            
            return res.send(err)
        }
	    
	    await browser.close();
	    return res.send("done")
	  
    }
})


app.listen(process.env.PORT || 3000, (err) => {
	if(err) throw err;
})  
