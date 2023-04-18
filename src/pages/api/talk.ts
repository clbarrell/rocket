// pages/api/upload.js
import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { IncomingForm } from "formidable";
import fs from "fs";
import log from "@/lib/log";
import { Configuration, OpenAIApi } from "openai";

// const FormidableError = formidable.errors.FormidableError;

// const parseForm = async (
//   req: NextApiRequest
// ): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
//   return new Promise(async (resolve, reject) => {
//     resolve({
//       files: {},
//       fields: {},
//     });
//   });
// };

export default async function talk(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({
      data: null,
      error: "Method Not Allowed",
    });
    return;
  }

  log("received");

  // Create a new incoming form object
  const form = new IncomingForm();

  // Parse the incoming request with formidable
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing form data:", err);
      return res.status(500).json({ error: "Failed to parse form data" });
    }

    // Check if the 'file' field exists in the form data
    if (!files || !files.file) {
      return res.status(400).json({ error: "No file found in form data" });
    }

    try {
      // Read the file from the temporary location
      // const file = fs.readFileSync(files.file.path);;
      const file = Array.isArray(files.file)
        ? fs.readFileSync(files.file[0].filepath)
        : fs.readFileSync(files.file.filepath);

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const resp = await openai.createTranscription(
        file,
        "whisper-1"
      );
        

      // Return a response indicating successful file processing
      return res
        .status(200)
        .json({ message: "File uploaded and processed successfully" });
    } catch (error) {
      console.error("Error processing file:", error);
      return res.status(500).json({ error: "Failed to process file" });
    }
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
