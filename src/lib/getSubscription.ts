import { prisma } from "@/app/api/auth/[...nextauth]/route";

export async function getSubscription (session: any) {
  return await prisma.userSubscription.findFirst({
    where: {
      userId: session?.user?.id
    }
  })
}