"use client"
import { User, getServerSession } from "next-auth"
import Dropdown from "./Dropdown"
import { getSession, signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"
import Link from "next/link"
import Image from "next/image"
import SubscribeBillingBtn from "./SubscribeBillingBtn"

export default function Header () {
  const session = useSession()
  const user = session?.data?.user 
  
  return <header className="my-2">
    <nav className="max-w-6xl mx-auto border p-5 flex items-center justify-between">
      <Link href={"/"} prefetch={false}>
        <p className=" font-semibold text-muted-foreground">jobs<span className="underline">by</span>cv</p>
      </Link>

      <div className="right flex items-center space-x-2">
        {user ? <>
          <SubscribeBillingBtn />
          <Dropdown user={user} />
        </> : <Button onClick={() => signIn()}>Log in</Button>}
      </div>
    </nav>
  </header>
}