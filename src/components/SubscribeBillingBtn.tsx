"use client"

import { checkSubscription } from "@/lib/subscription"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"
import { UserSubscription } from "@prisma/client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function SubscribeBillingBtn () {
  const {data: session}: any = useSession()
  const [isSubbed, setIsSubbed] = useState <UserSubscription | null | undefined>(null)
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      getSubStatus()
    }
  }, [session])

  async function getSubStatus () {
    try {
      const subscription = await checkSubscription()
      setIsSubbed(subscription)
    } catch (error) {
      console.error(error)
    }

  }

  async function handleClick() {
    try {
      const {data: { url }} = await axios.get("/api/stripe")
      router.push(url)
    } catch (error) {
      console.error(error)
    }
  }
  

  return <Button onClick={handleClick}>
    {isSubbed ? "Billing" : "Upgrade to Premium"}
  </Button>
}