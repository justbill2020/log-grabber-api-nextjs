const chromium = require('chrome-aws-lambda')
// const playwright = require('playwright-core') // 1
const Cors = require('cors')
const revision = chromium.puppeteer._preferredRevision
const cors = Cors({
  methods:['POST']
})

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async (req, res) => { // 2
  await runMiddleware(req,res,cors)
    if (req.method === 'POST') { // 3
      const url = req.body.url

      async function rej(e,res, newfn){
        newfn()
        res.statusCode = 404
        return res.json({
          url: url,
          error: `${url} not found. Tip: Double check the spelling.`
        })
      }
      
      await chromium.font("https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf")

      let executablePath =  await chromium.executablePath 
      if (!executablePath) {
        const browserFetcher = chromium.puppeteer.createBrowserFetcher()
        const currVersions = await browserFetcher.localRevisions()
        if (!currVersions.includes(revision)) {
          const revInfo = await browserFetcher.download(revision)
        }
        executablePath = revInfo.executablePath
      }
      const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        ignoreHTTPSErrors: true,
        executablePath,
        headless: chromium.headless,
      }).catch((e)=>{
          re(e,res, async (browser)=>{
            if (browser) await browser.close()
          })
      });
      try {
        const context = await browser.newContext()
        const page = await context.newPage({
          acceptDownloads:true, 
          userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) chromium/92.0.4515.107 Safari/537.36"
        })
        await page.goto(url)
        const element = await page.$$('img')
        const shouldFilter = await Promise.all(element.map(async (imgElm) => {
          let elmRes = await imgElm.getAttribute('src')
          return elmRes.includes("logo")
        }))
        const filElm = element.filter((elem, index)=> shouldFilter[index])
        const logoSrc = await filElm[0].getAttribute('src')
        const logoUrlString = logoSrc.startsWith('http') ? logoSrc : `${url.endsWith('/') ? url.slice(0,url.length-1) : url}/${logoSrc.startsWith('/') ? logoSrc.slice(1) : logoSrc }`
        await browser.close()

        if (!logoUrlString) throw Error

        res.statusCode = 200
        return res.json({
          url: url,
          logoUrl: logoUrlString,
        })
      } catch (e) { // 5
        rej.bind({browser,res},e)
      }
    }
}