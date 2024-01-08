import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from "next"
import { useSession } from "next-auth/react"
import { authOptions } from "../auth/[...nextauth]/route"

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions)

  try {
    if (session) {
      const data = await req.json();

      console.log(data.pdfText);
      
    } else {
      return NextResponse.json({ success: false }, { status: 401 })
    }
  } catch (error) {
    console.error(error)
  }

 
  return NextResponse.json({ success: true }, { status: 200 })
}