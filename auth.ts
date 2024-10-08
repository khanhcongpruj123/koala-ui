import NextAuth from 'next-auth'
import Keycloak from '@auth/core/providers/keycloak'
import { JWTOptions } from 'next-auth/jwt'
import { Adapter } from 'next-auth/adapters'
import { OpenAPI, UserService } from './server_sdk'
import { getServerSdkInstance as getServerSdk } from './server_sdk/server'

declare module 'next-auth' {
  interface Session {
    idToken: string
    accessToken: string
    refreshToken: string
  }

  interface User {
    idToken: string
    accessToken: string
    refreshToken: string
  }

  interface JWT {
    id: string
    idToken: string
    accessToken: string
    refreshToken: string
    provider: string
  }
}

const keycloakProvider = Keycloak

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  providers: [keycloakProvider],
  callbacks: {
    // this callback will generate JWT token from what you return
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }

      if (account && user) {
        // create user if not exist
        try {
          const sdk = getServerSdk()
          const { exist } = await sdk.user.existsUserByIdToken({
            idToken: account.id_token as string,
          })
          if (!exist) {
            const userProfile = await sdk.user.createUser({
              idToken: account.id_token as string,
              username: user.name as string,
            })
            console.log('Create user profile after login', userProfile)
          } else {
            console.log('User profile already exist')
          }
        } catch (error) {
          // TODO: navigate to error page
          console.error('Failed to create user profile', error)
        }

        token.accessToken = account.access_token
        token.idToken = account.id_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
      }
      return token
    },
    // this callback will get claim from JWT token
    // you can choose what information need save into session
    session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.idToken = token.idToken as string
      session.refreshToken = token.refreshToken as string
      session.user.id = token.id as string
      return session
    },
  },
  events: {
    async signOut(
      message:
        | { session: Awaited<ReturnType<Required<Adapter>['deleteSession']>> }
        | { token: Awaited<ReturnType<JWTOptions['decode']>> },
    ) {
      const { token } = message as { token: Awaited<ReturnType<JWTOptions['decode']>> }
      if (token) {
        try {
          // sign out from keycloak
          const params = new URLSearchParams()
          params.append('id_token_hint', token.idToken as string)
          const url = `${process.env.AUTH_KEYCLOAK_ISSUER}/protocol/openid-connect/logout?${params.toString()}`
          await fetch(url, {
            method: 'GET',
          })
        } catch (error) {
          console.error('Failed to sign out from keycloak', error)
        }
      }
    },
  },
})
