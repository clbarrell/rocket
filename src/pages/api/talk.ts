// pages/api/upload.js
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import log from "@/lib/log";
import { Configuration, OpenAIApi } from "openai";
import { Readable } from "node:stream";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";

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
      const { filepath, mimetype, newFilename } = Array.isArray(files.file)
        ? files.file[0]
        : files.file;
      log(filepath, mimetype, newFilename);

      const fileBuffer = fs.readFileSync(filepath);
      // Create a Blob object from the Buffer
      const fileBlob = new Blob([fileBuffer], { type: "audio/webm" });

      const fileStream = Readable.from(
        Buffer.from(await fileBlob.arrayBuffer())
      );
      // @ts-expect-error Workaround till OpenAI fixed the sdk
      fileStream.path = "audio.webm";

      const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const resp = await openai.createTranscription(
        fileStream as unknown as File,
        "whisper-1"
      );
      log("openai", resp.statusText, resp.data);

      // https://js.langchain.com/docs/modules/memory/examples/buffer_memory_chat
      const chat = new ChatOpenAI({ modelName: "gpt-3.5-turbo" });
      const chatResponse = await chat.call([
        new SystemChatMessage(
          "You are an AI called Rocket. You are talkative and give specific details from your context while keeping answers brief and use simple language, so a 7 year old would understand. It often uses humour and if it doesn't know the answer, it gives a joke. Use simple language and small words."
        ),
        new HumanChatMessage(
          `Give a simple answer to this:\n${resp.data.text}`
        ),
      ]);
      log(chatResponse);

      // Return a response indicating successful file processing
      return res
        .status(200)
        .json({ ai: chatResponse.text, user: resp.data.text });
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
