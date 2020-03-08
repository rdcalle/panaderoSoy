import SimpleCrypto from 'simple-crypto-js'
import moment from 'moment'

const SALT = '!panaderoSoy"'
const acceptedPasswd = '!"v1Kt04'
const expirationTime = 15 * 60 * 1000

const simpleCrypto = new SimpleCrypto(SALT)

const cleanSession = () => {
  console.info('borramos token')
  interval = 0
  sessionStorage.setItem('token', '')
  window.dispatchEvent(new Event('storage'))
}

export const keepAliveSession = () => {
  interval = 0
}

export const chiperedPasswd = passwd => simpleCrypto.encrypt(passwd)

export const checkPasswd = ciphered => {
  const [decrypted, hour] = simpleCrypto.decrypt(ciphered).split(';')
  return Number(hour) === moment().hour() && decrypted === acceptedPasswd
}

export const checkValidToken = token => {
  return (
    simpleCrypto.decrypt(
      chiperedPasswd(`${acceptedPasswd};${moment().hour()}`),
    ) === simpleCrypto.decrypt(token)
  )
}

export const setSession = ciphered => {
  sessionStorage.setItem('token', ciphered)
  keepAliveSession()
}

const every = 1000
let interval = 0
setInterval(() => {
  interval += every
  if (interval > expirationTime) {
    cleanSession()
  } else if (expirationTime - interval === 60000) {
    window.dispatchEvent(new Event('timeout'))
  }
}, every)
