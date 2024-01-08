import ListingsForm from "@/components/ListingsForm"
import axios from "axios"
import { headers } from "next/headers"

export default async function Listings() {

  // try {
  //   const listings = await fetch(("http://localhost:3000/api/listings"), {
  //     method: "GET",
  //     headers: headers()
  //   })
  // } catch (error) {
  //   console.log("error in listings request")
  // }
  

  


  return <main>
    <div className="max-w-6xl mx-auto border p-5">

      <ListingsForm />
      
    </div>
  </main>
}