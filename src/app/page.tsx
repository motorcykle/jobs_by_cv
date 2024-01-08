"use client"
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  const session = useSession()

  return (
    <main className="">
      <div className="max-w-6xl mx-auto border p-5">

        

      </div>
    </main>
  )
}
