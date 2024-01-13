import { getServerSession } from "next-auth";
import { authOptions, prisma } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const session: any = await getServerSession(authOptions);

  try {
    if (session) {
      const subscription = await prisma.userSubscription.findUnique({
        where: {
          id: session?.user?.id
        }
      })

      return NextResponse.json({ subscription }, { status: 200 });
    } else {
      throw Error("user not logged in")
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
