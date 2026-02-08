import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Ambil Key dari Environment Variable (Vercel)
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt, image } = await req.json();
    
    // Setting model agar bahasa santai & asik
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: "Nama kamu adalah XYZ. Kamu adalah AI yang gaul, asik, dan pinter. Jangan pakai bahasa formal yang kaku. Gunakan bahasa yang akrab seperti teman, tapi tetap sopan dan sangat membantu. Gunakan sedikit emoji agar pesan terasa hidup."
    });

    let result;
    if (image) {
      const imageParts = [{ inlineData: { data: image.split(",")[1], mimeType: "image/jpeg" } }];
      result = await model.generateContent([prompt || "Coba cek foto ini dong", ...imageParts]);
    } else {
      result = await model.generateContent(prompt);
    }

    const response = await result.response;
    return NextResponse.json({ response: response.text() });
  } catch (e: any) {
    return NextResponse.json({ error: "XYZ Error: Jalur sibuk!" }, { status: 500 });
  }
}
