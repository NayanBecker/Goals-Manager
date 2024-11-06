import { db } from '@/db'
import { goals, users } from '@/db/schema'
import {
  getAccessTokenFromCode,
  getUserFromAccessToken,
} from '../modules/github-autho'
import { eq } from 'drizzle-orm'
import { authenticatedUser } from '../modules/auth'

interface AuthenticateFromGitHubRequest {
  code: string
}

export async function authenticateFromGitHub({
  code,
}: AuthenticateFromGitHubRequest) {
  const accessToken = await getAccessTokenFromCode(code)
  const gitHubUser = await getUserFromAccessToken(accessToken)

  const result = await db
    .select()
    .from(users)
    .where(eq(users.externalAccountID, gitHubUser.id))

  let userId: string | null

  const userAlreadyExist = result.length > 0

  if (userAlreadyExist) {
    userId = result[0].id
  } else {
    const [insertedUser] = await db
      .insert(users)
      .values({
        name: gitHubUser.name,
        email: gitHubUser.email,
        avatarUrl: gitHubUser.avatar_url,
        externalAccountID: gitHubUser.id,
      })
      .returning()

    userId = insertedUser.id
  }

  const token = await authenticatedUser(userId)

  return token
}
