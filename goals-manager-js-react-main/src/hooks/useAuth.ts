import Cookies from 'universal-cookie'

export function useAuth() {
  const cookies = new Cookies()
  const token = cookies.get('goals-manager.token')

  return {
    isAuthenticated: Boolean(token),
    token,
  }
}
