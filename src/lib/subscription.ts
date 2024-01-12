import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function checkSubscription () {
  const session: any = await getServerSession(authOptions);

  try {
    if (session?.user) {
      const subscription = await prisma.userSubscription.findUnique({
        where: {
          id: session?.user?.id,
        }
      })

      return subscription
    }
  } catch (error) {
    console.error(error)
  }
}