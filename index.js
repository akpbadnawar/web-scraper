const selectors = {
    "publication-date": "#block-views-block-view-noticia-pbh-block-5 > div > div > div > div > div > div > div.views-field.views-field-nothing > span > span:nth-child(1)",
    "object": "#block-views-block-view-noticia-pbh-block-5 > div > div > div > div > div > div > div.views-field.views-field-nothing > span > p:nth-child(6)",
    "biding-date": "#block-views-block-view-noticia-pbh-block-5 > div > div > div > div > div > div > div.views-field.views-field-nothing > span > span:nth-child(19)",
    "link": "#block-views-block-view-noticia-pbh-block-5 > div > div > div > div > div > div > div.views-field.views-field-field-historico-da-licitacao > div > table > tbody > tr > td:nth-child(2) > div > div > div > a"
}

const puppeteer = require('puppeteer');
const { translateText, translateDocs } = require('puppeteer-google-translate');
const defaultTimeout = 60;

const opt = { from: 'pt', to: 'en', timeout: 10000, headless: true };

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(1000*defaultTimeout);
    await page.goto('https://prefeitura.pbh.gov.br/saude/licitacao/pregao-eletronico-151-2020');

    for (const property in selectors) {
        
        const selector = selectors[property];
        
        if (property === "link") {
            const value = await page.evaluate((selector) => {
                const foundElements = document.querySelectorAll(selector);
                if (!foundElements) {
                    return null;
                }
                const values = [];
                foundElements.forEach(element => {
                    const value = element.href;
                    values.push(value);
                });
                return values;
            }, selector);
            console.log("%s : %o", property, value);
        } else {


            const value = await page.evaluate((selector) => {
                const foundElement = document.querySelector(selector);
                if (!foundElement){
                    return null;
                }
                return foundElement.textContent;
            }, selector);

            translateText(value, opt).then((result) => {
                console.log("%s : %o", property, result);
            });
        }
    }

    await browser.close();
})();