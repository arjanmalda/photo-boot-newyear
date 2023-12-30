import { db } from "@/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { photos } = await request.json();

  try {
    const docs = await getDocs(query(collection(db, "selection")));
    docs.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    const docRef = await addDoc(collection(db, "selection"), { photos });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return NextResponse.json({ status: "ok", body: { photos } });
}

export async function GET() {
  try {
    // console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }

  return NextResponse.json({ status: "ok" });
}
