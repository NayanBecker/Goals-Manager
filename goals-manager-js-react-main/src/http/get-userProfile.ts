import Cookies from 'universal-cookie'

// Interface que descreve o formato da resposta
export interface GetProfileResponse {
  profile: {
    id: string
    name: string | null
    email: string | null
    avatarUrl: string
  }
}
export async function getProfile(): Promise<GetProfileResponse> {
  // Instancia o gerenciador de cookies
  const cookies = new Cookies()

  const token = cookies.get('goals-manager.token')
  console.log('Token enviado para o backend:', token)

  const response = await fetch('http://localhost:3333/profile', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Erro ao buscar o perfil do usuário')
  }

  const data = await response.json()

  return data
}
