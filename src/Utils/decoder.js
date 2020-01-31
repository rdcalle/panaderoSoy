const utfQ = text =>
  decodeURIComponent(
    text
      .match(/=\?(.+)\?=/)[1]
      .replace(/[uU][tT][fF]-8\?Q\?/g, '')
      .replace(/_/g, ' ')
      .replace(/\?=.*=\?/g, '')
      .replace(/=/g, '%'),
  )

const utfB = text =>
  text
    .match(/=\?(.+)\?=/)[1]
    .replace(/[uU][tT][fF]-8\?B\?/g, '')
    .split(/\?=.*=\?/)
    .map(subtext =>
      decodeURIComponent(
        atob(subtext)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      ),
    )
    .join('')

const isoQ = text =>
  unescape(
    text
      .match(/=\?(.+)\?=/)[1]
      .replace(/[Ii][Ss][Oo]-8859-1\?Q\?/g, '')
      .replace(/_/g, ' ')
      .replace(/\?=.*=\?/g, '')
      .replace(/=/g, '%'),
  )

const isoB = text =>
  text
    .match(/=\?(.+)\?=/)[1]
    .replace(/[Ii][Ss][Oo]-8859-1\?B\?/g, '')
    .split(/\?=.*=\?/)
    .map(subtext =>
      unescape(
        atob(subtext)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      ),
    )
    .join('')

const w1252Q = text =>
  unescape(
    text
      .match(/=\?(.+)\?=/)[1]
      .replace(/[wW]indows-1252\?Q\?/g, '')
      .replace(/_/g, ' ')
      .replace(/\?=.*=\?/g, '')
      .replace(/=/g, '%'),
  )

const w1252B = text =>
  atob(text.match(/=\?(.+)\?=/)[1].replace(/[wW]indows-1252\?B\?/g, ''))

const isUtfQ = text => /=\?[uU][tT][fF]-8\?Q\?/.test(text)
const isUtfB = text => /=\?[uU][tT][fF]-8\?B\?/.test(text)
const isIsoQ = text => /=\?[Ii][Ss][Oo]-8859-1\?Q\?/.test(text)
const isIsoB = text => /=\?[Ii][Ss][Oo]-8859-1\?B\?/.test(text)
const isW1252B = text => /[wW]indows-1252\?B\?/.test(text)
const isW1252Q = text => /[wW]indows-1252\?Q\?/.test(text)

const decoder = text => {
  try {
    return isUtfQ(text)
      ? utfQ(text)
      : isUtfB(text)
      ? utfB(text)
      : isIsoQ(text)
      ? isoQ(text)
      : isIsoB(text)
      ? isoB(text)
      : isW1252B(text)
      ? w1252B(text)
      : isW1252Q(text)
      ? w1252Q(text)
      : text
  } catch (error) {
    console.error(text, error)
    return text
  }
}

export default decoder
