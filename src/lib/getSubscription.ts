import { prisma } from "./prisma";


export async function getSubscription (session: any) {
  return await prisma.userSubscription.findFirst({
    where: {
      userId: session?.user?.id
    }
  })
}