const utfQ = text => {
  const lastReadableLetterPos = text.match(/[\u{0080}-\u{FFFF}]/u) || {
    index: text.length,
  }
  return decodeURIComponent(
    text
      .substr(0, lastReadableLetterPos.index)
      .replace(/%/g, '%25')
      .replace(/=([A-Z0-9]{2})/g, '%$1')
      .replace(/%([A-Z0-9]{2})=\n/g, '%$1')
      .replace(/ =/g, ' ')
      .replace(/=\n/g, '\n'),
  )
}

const utfB = text => {
  const encodedText = text
    .replace(/\n/g, '')
    .match(/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/)
  return decodeURIComponent(
    atob(encodedText[0])
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join(''),
  )
}

const isoQ = text => {
  const lastReadableLetterPos = text.match(/[\u{0080}-\u{FFFF}]/u) || {
    index: text.length,
  }
  return unescape(
    text
      .substr(0, lastReadableLetterPos.index)
      .replace(/=([A-Z0-9]{2})/g, '%$1')
      .replace(/=\n/g, '\n'),
  )
}

const avoidingLines = /((X-|Thread|Content-type|MIME|Message-ID)|SpamAssassin|BAYES|Date:|Subject:|To:|From:|URIBL)/i
const contentDecoder = content => {
  try {
    let pos = 0
    const extractedData = (content || [])
      .reduce((mailData, line) => {
        if (/charset/.test(line)) {
          pos = !mailData[pos] || !mailData[pos].charset ? pos : pos + 1
          const theCharset = line.match(/charset="?((utf|iso|windows).+)"?/i)
          if (theCharset)
            mailData[pos] = {
              ...mailData[pos],
              charset: theCharset[1],
            }
        } else if (
          /Content-Transfer-Encoding: (quoted-printable|base64)/i.test(line)
        ) {
          pos = !mailData[pos] || !mailData[pos].encoding ? pos : pos + 1
          mailData[pos] = {
            ...mailData[pos],
            encoding: line.match(/Content-Transfer-Encoding: (.+)/i)[1],
          }
        } else if (avoidingLines.test(line)) return mailData
        else if (mailData[pos] && mailData[pos].charset)
          mailData[pos] = {
            ...mailData[pos],
            body: (mailData[pos].body || '') + line + '\n',
          }

        return mailData
      }, [])
      .map(({ charset, encoding, body }) =>
        /utf/i.test(charset)
          ? /quoted/i.test(encoding)
            ? utfQ(body)
            : /base64/i.test(encoding)
            ? utfB(body)
            : body
          : /(iso|windows)/i.test(charset)
          ? /quoted/i.test(encoding)
            ? isoQ(body)
            : body
          : body,
      )

    return extractedData.join('')
  } catch (err) {
    console.error(err)
    return content
  }
}

export default contentDecoder
