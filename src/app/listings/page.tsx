import ListingsForm from "@/components/ListingsForm"
import axios from "axios"
import { headers } from "next/headers"

export default async function Listings() {

  return <main>
    <div className="max-w-6xl mx-auto border p-5">

      <ListingsForm />
      
    </div>
  </main>
}