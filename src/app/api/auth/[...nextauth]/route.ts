
import { PrismaClient } from '@prisma/client'
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { authOptions } from '@/lib/AuthOptions';

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }