"use client"

import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import ListingAd from "./ListingAd";

export default function ListingsForm() {
  const [loading, setLoading] = useState(false);
  const [listingsResponse, setListingsResponse] = useState <{ listings: [], remaining_tries: number} | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get("pdfFile") as File;
  
    if (file) {
      setLoading(true);
  
      const fileReader = new FileReader();
  
      fileReader.onload = async () => {
        const base64String = fileReader.result as string;
  
        try {
          const response = await axios.post(process.env.NEXT_BASE_URL + "/api/listings", { pdfText: base64String });
  
          if (response) {
            // Handle successful response
            console.log("PDF text sent successfully");
          } else {
            // Handle error response
            console.error("Failed to send PDF text");
          }
        } catch (error) {
          // Handle fetch error
          console.error("Fetch error:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fileReader.readAsDataURL(file);
    }
  };
  
  

  return (
    <section>
      <section className="space-y-3">
        <h2 className="text-2xl">Upload your CV</h2>
        <FilePond
          server={{
            fetch: null,
            revert: null,
            process: {
              url: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_BASE_URL : ""}/api/listings`,
              method: 'POST',
              onload: (response) => {
                setListingsResponse(JSON.parse(response))
                console.log(JSON.parse(response))
                return response
              },
            },
          }}
        />
      </section>

      {listingsResponse && (<section className="flex flex-col gap-3">
        <h2 className="text-2xl">Listings</h2>
        {listingsResponse?.listings?.map((listing: any) => <ListingAd key={listing?.link} listing={listing} />)}
      </section>)}

    </section>
  );
}
