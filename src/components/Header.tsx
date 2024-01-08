"use client"

import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { User, getServerSession } from "next-auth"
import Dropdown from "./Dropdown"
import { getSession, signIn, useSession } from "next-auth/react"
import { Button } from "./ui/button"

export default function Header () {
  const session = useSession()
  const user = session?.data?.user 
  console.log(user)
  

  return <header className="my-2">
    <nav className="max-w-6xl mx-auto border p-5 flex items-center justify-between">
      <p className=" font-semibold text-muted-foreground">jobs<span className="underline">by</span>cv</p>

      <div className="right">
        {user ? <Dropdown user={user} /> : <Button onClick={() => signIn()}>Log in</Button>}
      </div>
    </nav>
  </header>
}