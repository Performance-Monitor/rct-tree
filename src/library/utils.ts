export function getCookie(name: string): string | null {
  const cookieName = encodeURIComponent(name) + '='
  const cookieStart = document.cookie.indexOf(cookieName)
  let cookieValue = null

  if (cookieStart > -1) {
    let cookieEnd = document.cookie.indexOf(';', cookieStart)
    if (cookieEnd === -1) {
      cookieEnd = document.cookie.length
    }
    cookieValue = decodeURIComponent(
      document.cookie.substring(cookieStart + cookieName.length, cookieEnd)
    )
  }
  return cookieValue
}

export function setCookie(
  name: string,
  value: string,
  expires?: Date,
  path?: string,
  domain?: string,
  secure?: boolean
) {
  let cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  if (expires instanceof Date) {
    cookieText += '; expires=' + expires.toUTCString()
  }

  if (path) {
    cookieText += '; path=' + path
  }

  if (domain) {
    cookieText += '; domain=' + domain
  }

  if (secure) {
    cookieText += '; secure'
  }
  document.cookie = cookieText
}

export function unsetCookie(
  name: string,
  path?: string,
  domain?: string,
  secure?: boolean
) {
  path = path || window.location.pathname
  domain = domain || window.location.hostname
  const source = path.replace(/^\/|\/$/g, '').split('/')
  let pre = ``
  const paths = source.map((item, index) => {
    pre = `${pre}/${item}`
    return pre
  })
  paths.forEach(p => {
    setCookie(name, '', new Date(0), p, domain, secure)
    setCookie(name, '', new Date(0), p, `.` + domain, secure)
  })
}

export function base64Decode(str: string) {
  str = window
    .atob(str)
    .split('')
    .map((c: string) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    })
    .join('')
  return decodeURIComponent(str)
}

export function compose(
  f: (...args: any[]) => any,
  g: (...args: any[]) => any
) {
  return function composeWrap(x: any) {
    return f(g(x))
  }
}

export function getTokenKey(){
  const env = window.ENV ? window.ENV.toLowerCase() : 'local'

  let key = 'token'
  if (env !== 'local') {
    key = `${env}-auth-token`
  }
  
  return key
}

export function getToken() {
  const key = getTokenKey()

  return getCookie(key)
}

export function getJWT(check: boolean = false) {
  const token = getToken()
  let payload = ''
  let jwt = null
  if (token) {
    payload = token.split('.')[1]
  }
  try {
    jwt = JSON.parse(base64Decode(payload))
  } catch (e) {
    return null
  }
  return jwt
}

export function parseQuery(key: string) {
  const queryStr = window.location.search.replace('?', '')
  const queryMap: any = {}

  for (const param of queryStr.split('&')) {
    const [key, value] = param.split('=')
    queryMap[key] = value
  }

  return queryMap[key]
}
