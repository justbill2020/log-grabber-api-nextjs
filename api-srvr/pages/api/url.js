const cheerio = require('cheerio') // 1

export default async (req, res) => { // 2
  if (req.method === 'GET') { // 3
    const url = req.body.url

    try { // 4
      const response = await fetch(`${url}`)
      const htmlString = await response.text()
      const $ = cheerio.load(htmlString)
      const searchContext = `img`
      const followerCountString = $(searchContext)
        .text()
        .match(/logo/gi)
        .join('')

      res.statusCode = 200
      return res.json({
        url: url,
        logoUrl: followerCountString,
      })
    } catch (e) { // 5
      res.statusCode = 404
      return res.json({
        url: url,
        error: `${url} not found. Tip: Double check the spelling.`
      })
    }
  }
}