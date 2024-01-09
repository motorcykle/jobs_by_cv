import { getServerSession } from "next-auth"
import { NextRequest, NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from "next"
import { useSession } from "next-auth/react"
import { authOptions } from "../auth/[...nextauth]/route"
import { promises as fs } from 'fs'; // To save the file temporarily
import { v4 as uuidv4 } from 'uuid'; // To generate a unique filename
import PDFParser from 'pdf2json'; // To parse the pdf
import OpenAI from "openai";
import { checkSubscription } from "@/lib/subscription"
import { getFreeTries, updateFreeTries } from "@/lib/freetries"

const openai = new OpenAI({ apiKey: process.env.OPEN_AI });


export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions)
  const freeTries = getFreeTries()
  const isSubbed = checkSubscription()

  try {
    if (session && (isSubbed || freeTries > 0)) {
      const formData: FormData = await req.formData();
      const uploadedFiles = formData.getAll('filepond');

      let fileName = '';
      let parsedText = '';

      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[1];
        console.log('Uploaded file:', uploadedFile);

        if (uploadedFile instanceof File) {
          fileName = uuidv4();

          // Convert the uploaded file into a temporary file
          const tempFilePath = `/tmp/${fileName}.pdf`;
          const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());
          await fs.writeFile(tempFilePath, fileBuffer);
          const pdfParser = new (PDFParser as any)(null, 1);

          // See pdf2json docs for more info on how the below works.
          pdfParser.on('pdfParser_dataError', (errData: any) =>
            console.log(errData.parserError)
          );
          pdfParser.on('pdfParser_dataReady', () => {
            console.log((pdfParser as any).getRawTextContent());
            parsedText = (pdfParser as any).getRawTextContent();
          });

          pdfParser.loadPDF(tempFilePath);
        } else {
          console.log('Uploaded file is not in the expected format.');
        }
      } else {
        console.log('No files found.');
      }



      // console.log(parsedText)
      const openaiRes = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
              {
                  role: "system",
                  content: ``,
              }
          ],
      });

      if (openaiRes.created) {
          // update tries
          updateFreeTries()
      }

      return NextResponse.json({ response: openaiRes.choices[0]}, { status: 200 })
    } else {
      return NextResponse.json({ success: false }, { status: 401 })
    }
  } catch (error) {
    console.error(error)
  }

 
  return NextResponse.json({ success: true }, { status: 200 })
}