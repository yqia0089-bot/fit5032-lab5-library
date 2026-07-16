const AUTH_KEY = 'fit5032-library-authenticated'

export const login = (username, password) => {
  const validUsername = 'student'
  const validPassword = 'Library123!'

  if (username === validUsername && password === validPassword) {
    sessionStorage.setItem(AUTH_KEY, 'true')
    return true
  }

  return false
}

export const logout = () => {
  sessionStorage.removeItem(AUTH_KEY)
}

export const isAuthenticated = () => {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}
