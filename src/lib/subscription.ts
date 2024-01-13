import { authOptions, prisma } from "@/app/api/auth/[...nextauth]/route";
import axios from "axios";
import { getServerSession } from "next-auth";

export async function checkSubscription () {
  try {
    const { data } = await axios.get("/api/subscription")
    return data.subscription
  } catch (error) {
    console.error(error)
  }
}