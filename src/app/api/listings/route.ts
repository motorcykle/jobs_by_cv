import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import PDFParser from 'pdf2json';
import OpenAI from "openai";
import { checkSubscription } from "@/lib/subscription";
import { getFreeTries, updateFreeTries } from "@/lib/freetries";
import { getListings } from "@/lib/pupp";
import { getSubscription } from "@/lib/getSubscription";
import { authOptions } from "@/lib/AuthOptions";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI });

const completion = async (text: any) => {
  const openaiRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an assistant that helps generate job search links based on CVs. Provide only the link without any additional text. Use [JOB] for the job, [LOCATION] for the location, and [COUNTRY] for the country. For example, for a fit job 'Software Engineer' in a fit location 'Barcelona' and a fit country 'Spain', the link should be https://[COUNTRY_CODE].indeed.com/jobs?q=Software%20Engineer&l=Barcelona&radius=50&sort=date if from the us then: https://indeed.com/jobs?q=Software%20Engineer&l=Barcelona&radius=50&sort=date",
      },
      {
        role: "user",
        content: `Based off of this CV: ${text}, look at the location and country mentioned. Suggest jobs that would fit and provide only the link.`,
      },
    ],
  });
  
  
  let updatedTries;
  if (openaiRes.created) {
    // update tries
    updatedTries = await updateFreeTries();
  }

  console.log(updatedTries, "37")

  return { link: openaiRes.choices[0].message.content, remaining_tries: updatedTries?.tries };
};

export async function POST(req: NextRequest, res: NextResponse) {
  const session: any = await getServerSession(authOptions);
  const freeTries = await getFreeTries();
  const isSubbed = await getSubscription(session);

  try {
    if (session && (isSubbed || (freeTries && freeTries > 0))) {
      const formData: FormData = await req.formData();
      const uploadedFiles = formData.getAll('filepond');

      if (uploadedFiles && uploadedFiles.length > 0) {
        const uploadedFile = uploadedFiles[1];
        console.log('Uploaded file:', uploadedFile);

        if (uploadedFile instanceof File) {
          const fileName = uuidv4();
          const tempFilePath = `/tmp/${fileName}.pdf`;
          const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer());

          await fs.writeFile(tempFilePath, fileBuffer);

          const pdfParser = new (PDFParser as any)(null, 1);

          // Promisify the pdfParser
          const pdfParserPromise = () => new Promise<void>((resolve) => {
            pdfParser.on('pdfParser_dataReady', () => {
              resolve();
            });
          });

          pdfParser.loadPDF(tempFilePath);

          // Wait for the pdfParser_dataReady event
          await pdfParserPromise();

          // Now, the parsing is complete, and you can use parsed data
          const parsedText = pdfParser.getRawTextContent();
          const data = await completion(parsedText);
          const listings = await getListings(data.link!)

          return NextResponse.json({ listings, remaining_tries: data.remaining_tries }, { status: 200 });
        } else {
          console.log('Uploaded file is not in the expected format.');
        }
      } else {
        console.log('No files found.');
      }
    } else {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
