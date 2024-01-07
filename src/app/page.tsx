"use client"
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  const session = useSession()

  return (
    <main className="">
      <p>{session?.data?.user?.name}</p>
      <button onClick={() => signIn()}>Log in</button>
      <button onClick={() => signOut()}>Log out</button>
    </main>
  )
}
