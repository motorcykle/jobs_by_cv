import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route"
import { Session, getServerSession } from "next-auth";

let freeTrials = 3


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



      console.log("from", freeTries, "here")
    }
  } catch (error) {
    console.error(error)
  }

  
  let freeTrials = 3
  return freeTrials
}

export function updateFreeTries () {
  return freeTrials =- 1
}