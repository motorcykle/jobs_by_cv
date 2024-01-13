import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import { getSubscription } from "@/lib/getSubscription";
import { authOptions } from "@/lib/AuthOptions";

export async function GET(req: NextRequest, res: NextResponse) {
  const session: any = await getServerSession(authOptions);

  try {
    if (session) {
      const subscription = await getSubscription(session)
      return NextResponse.json({ subscription }, { status: 200 });
    } else {
      throw Error("user not logged in")
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error }, { status: 400 });
  }
}
