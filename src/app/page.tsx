"use client"
import { Button } from '@/components/ui/button'
import { getSession, signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Home() {
  const session = useSession()
  const router = useRouter()

  return (
    <main className="">
      <div className="max-w-6xl mx-auto border p-5 space-y-7">

        <section className='space-y-3'>
          
            <div className='border-b p-3 pb-5 border-dotted'>
              <h1 className='text-4xl md:text-8xl'> <span className=' font-bold'>Get job listings,</span> <br /> based off of your cv.</h1>
            </div>
            <p className=' max-w-xl text-muted-foreground'>Upload your cv and let AI search for the jobs that match your CV content and get job listings for you to click on and apply.</p>
          
        </section>
        
        <Button onClick={() => {
          if (session?.data?.user) {
            router.push("/listings")
          } else {
            signIn()
          }
        }}>
          Get listings
        </Button>

      </div>
    </main>
  )
}
