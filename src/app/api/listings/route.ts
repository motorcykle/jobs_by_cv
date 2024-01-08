import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from "next"
import { useSession } from "next-auth/react"
import { authOptions } from "../auth/[...nextauth]/route"

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(authOptions)

  console.log(session?.user, "***")

  try {
    if (session) {
      console.log("we here", session)
    } else {
      return NextResponse.json({ success: false }, { status: 401 })
    }
  } catch (error) {
   
  }

 
  return NextResponse.json({ success: true }, { status: 200 })
}