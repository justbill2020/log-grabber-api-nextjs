const {chromium} = require('playwright') // 1


export default async (req, res) => { // 2
  if (req.method === 'POST') { // 3
    const url = req.body.url

    try {
      const browser = await chromium.launch()
      const context = await browser.newContext()
      const page = await context.newPage({acceptDownloads:true, userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) chromium/92.0.4515.107 Safari/537.36"})
      await page.goto(url)
      const element = await page.$$('img')
      const shouldFilter = await Promise.all(element.map(async (imgElm) => {
        let elmRes = await imgElm.getAttribute('src')
        return elmRes.includes("logo")
      }))
      const filElm = element.filter((elem, index)=> shouldFilter[index])
      const logoSrc = await filElm[0].getAttribute('src')
      const logoUrlString = logoSrc.startsWith('/') ? `${url}${logoSrc.slice(1)}` : logoSrc
      await browser.close()

      if (!logoUrlString) throw Error

      res.statusCode = 200
      return res.json({
        url: url,
        logoUrl: logoUrlString,
      })
    } catch (e) { // 5
      await browser.close()
      res.statusCode = 404
      return res.json({
        url: url,
        error: `${url} not found. Tip: Double check the spelling.`
      })
    }
  }
}