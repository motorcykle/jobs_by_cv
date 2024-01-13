
import { Session, getServerSession } from "next-auth";
import { authOptions } from "./AuthOptions";
import { prisma } from "./prisma";

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
  const currentTries: any = await getFreeTries()

  try {
    if (session?.user && currentTries > 0) {
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
    } else {
      return { tries: 0 }
    }
  } catch (error) {
    console.error(error)
  }
}