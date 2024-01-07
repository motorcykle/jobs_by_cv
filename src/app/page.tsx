"use client"
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="">
      <button onClick={() => signIn()}>Log in</button>
      <button onClick={() => signOut()}>Log out</button>
    </main>
  )
}
