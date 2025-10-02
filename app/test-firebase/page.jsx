'use client';

import { useEffect } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function TestFirebasePage() {
  useEffect(() => {
    // Check Auth
    onAuthStateChanged(auth, (user) => {
      console.log("✅ Auth state changed. User:", user);
    });

    // Check Firestore read/write
    async function testFirestore() {
      try {
        const testRef = doc(db, "testCollection", "testDoc");

        // write a value
        await setDoc(testRef, { hello: "world", timestamp: Date.now() });
        console.log("✅ Successfully wrote test document");

        // read the value back
        const snap = await getDoc(testRef);
        if (snap.exists()) {
          console.log("✅ Firestore document data:", snap.data());
        } else {
          console.log("❌ No document found");
        }
      } catch (err) {
        console.error("❌ Firestore test failed:", err.message);
      }
    }

    testFirestore();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Firebase Connection Test</h1>
      <p>Open your browser console (F12) to see the test results.</p>
    </div>
  );
}
