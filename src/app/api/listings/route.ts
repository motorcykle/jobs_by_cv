import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import PDFParser from 'pdf2json';
import OpenAI from "openai";
import { checkSubscription } from "@/lib/subscription";
import { getFreeTries, updateFreeTries } from "@/lib/freetries";

const openai = new OpenAI({ apiKey: process.env.OPEN_AI });

const completion = async (text: any) => {
  const openaiRes = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: `Based off of this CV: ${text}, look at the location mentioned in the cv and jobs that would fit and return me a link based on this structure: just replace [JOB] with fit job & [LOCATION] with fit location https://www.indeed.com/jobs?q=[JOB]&l=[LOCATION]&radius=50&sort=date`,
      },
    ],
  });

  if (openaiRes.created) {
    // update tries
    updateFreeTries();
  }

  console.log(openaiRes.choices[0]);
  return openaiRes.choices[0];
};

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const freeTries = getFreeTries();
  const isSubbed = checkSubscription();

  try {
    if (session && (isSubbed || freeTries > 0)) {
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

          return NextResponse.json({ data }, { status: 200 });
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
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
