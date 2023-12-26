import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { photo } = await request.json();

  try {
    const docRef = await addDoc(collection(db, "photos"), { photo });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return NextResponse.json({ status: "ok", body: { photo } });
}

export async function GET() {
  try {
    // console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return NextResponse.json({ status: "ok" });
}
