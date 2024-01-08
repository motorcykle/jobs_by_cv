"use client"

import { FormEvent, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

export default function ListingsForm() {
  const [loading, setLoading] = useState(false);

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
          const response = await axios.post("http://localhost:3000/api/listings", { pdfText: base64String });
  
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
    <section className="space-y-3">
      <h2 className="text-2xl">Upload your CV</h2>
      {/* <form onSubmit={handleSubmit} className="space-y-2" encType="multipart/form-data">
        <Input name="pdfFile" placeholder="Upload your CV here" type="file" accept=".pdf" />
        <Button type="submit" disabled={loading}>
          Get listings
        </Button>
      </form> */}
      <FilePond
        server={{
          process: '/api/listings',
          fetch: null,
          revert: null,
        }}
      />
    </section>
  );
}
