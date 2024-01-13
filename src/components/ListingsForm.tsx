"use client"

import { useState } from "react";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import ListingAd from "./ListingAd";

export default function ListingsForm() {
  const [loading, setLoading] = useState(false);
  const [listingsResponse, setListingsResponse] = useState <{ listings: [], remaining_tries: number} | null>(null)
  

  return (
    <section>
      <section className="space-y-3">
        <h2 className="text-2xl">Upload your CV</h2>
        <FilePond
          server={{
            fetch: null,
            revert: null,
            process: {
              url: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_URL : ""}/api/listings`,
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
