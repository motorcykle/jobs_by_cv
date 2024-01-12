import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"
import { Session, getServerSession } from "next-auth";

export async function getFreeTries () {
  const session: any = await getServerSession(authOptions);

  try {
    if (session?.user) {
      const freeTries = await prisma.user.findUnique({
        where: {
          id: session?.user?.id,
        },
        select: {
          tries: true
        }
      })

      return freeTries?.tries!
    }
  } catch (error) {
    console.error(error)
  }
}

export async function updateFreeTries () {
  const session: any = await getServerSession(authOptions);
  const currentTries = await getFreeTries()

  try {
    if (currentTries && session?.user && currentTries > 0) {
      const updatedTries = await prisma.user.update({
        where: {
          id: session?.user?.id,
        },
        data: {
          tries: currentTries - 1,
        },
        select: {
          tries: true
        }
      })
      return updatedTries
    }
  } catch (error) {
    console.error(error)
  }
}