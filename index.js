const cheerio = require('cheerio');
const request = require('request');

function parsePreviewThumbnail(body) {
  const $ = cheerio.load(body);

  // Check for open graph image
  let openGraphImageUrl = $('meta[property="og:image"]').attr('content');
  if (openGraphImageUrl) return openGraphImageUrl;

  let largestImage = $('img').reduce((prev, curr) => {
    return (curr.attribs.width > prev.attribs.width) ? curr : prev;
  });

  return largestImage.attribs.src;
}

function requestPreviewThumbnail(url) {
  return new Promise((resolve, reject) => {
    let decodedUrl = urlWithProtocol(decodeURIComponent(url));
    request(decodedUrl, (err, res, body) => {
      if (err || !body) reject(err);
      else resolve(parsePreviewThumbnail(body));
    });
  });
}

const httpProtocolExp = new RegExp("^https?://*");
function urlWithProtocol(url) {
  return !httpProtocolExp.test(url) ? "http://"+url : url;
}

module.exports = { parsePreviewThumbnail, requestPreviewThumbnail };
