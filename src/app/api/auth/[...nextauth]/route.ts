
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient()

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],
  events: {
    async signIn(message) {
      console.log(message.isNewUser)
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }