import puppeteer from 'puppeteer';


const baseMail  = "cuceusp@gmail.com";

const mail = "cuceusp+f2@gmail.com";
const pw = "Tester.123";


const createMailFormat = (mail) => {
    const [name,  company] = mail.split('@');
    const code = Math.random().toString().slice(13);
    return `${name}+${code}@${company}`;
}

let browser;
async function  Main(){
    // Launch the browser and open a new blank page
    browser = await puppeteer.launch({
        headless: false
    });

    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://platform.stability.ai/", ['clipboard-read']);


    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://platform.stability.ai/', { waitUntil: 'networkidle0' });
    await sleep(1000)

    const loginClass = ".cursor-pointer.select-none.text-sm";

    const headerElement = await page.$(loginClass);

    console.log(headerElement)
        // Interacting with the element
    await headerElement.click();

    await sleep(10000)

    await page.type('input[id="username"]', mail)
    await page.type('input[id="password"]', pw)
    await sleep(1000)

    const button = await page.$('button[name="action"]');
    button.click();


    await sleep(2000);

    await page.goto("https://platform.stability.ai/account/keys", { waitUntil: 'networkidle0' })

    const copyClass = ".relative.inline-block > .h-fit.grow-0.rounded-lg.duration-100.bg-brand-amber-1.text-black";

    const copybtn = await page.$(copyClass);
    // Interacting with the element
    await copybtn.click();
    await sleep(500);
    const apikey = await page.evaluate(() => navigator.clipboard.readText())
    console.log(apikey);

    await browser.close();




}


async function Register(){

    try{
     // Launch the browser and open a new blank page
     browser = await puppeteer.launch({
        headless: false
    });

    
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://platform.stability.ai/', { waitUntil: 'networkidle0' });
    await sleep(1000)

    const loginClass = ".cursor-pointer.select-none.text-sm";

    const headerElement = await page.$(loginClass);

    await headerElement.click();

    await sleep(1000*5)
    const registerClass = ".ulp-alternate-action a";

    const registerbtn = await page.$(registerClass);

    if(!registerbtn){

        throw new Error('registerbtn nesnesi yok');
    }

    

    await registerbtn.click(); 
    await sleep(5 * 1000);

    const cmail = createMailFormat(baseMail);
    
    console.log(cmail, pw);
    await page.type('input[id="email"]', cmail)
    await page.type('input[id="password"]', pw)
    await sleep(1000)

    const button = await page.$('button[name="action"]');
    button.click();



}catch(e){
    console.error(e);
    if(browser){
        await browser.close();
    }
}
    

}

async function sleep(ms){
    return await new Promise((r) => setTimeout(r, ms));
}

Register();


process.stdin.resume(); // so the program will not close instantly

async function exitHandler(options, exitCode) {
    if(browser){
        await browser.close();
        console.log('browser closed!')
    }
   
    process.exit();
}

// do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

// catches uncaught exceptions
//process.on('uncaughtException', exitHandler.bind(null, {exit:true}));