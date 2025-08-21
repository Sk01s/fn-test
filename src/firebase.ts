import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";

// Your config — use the same as in Firebase console/emulator
const firebaseConfig = {
  apiKey: "fake-api-key", // can be anything in emulator
  authDomain: "localhost",
  projectId: "demo", // match your emulator projectId
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

if (window.location.hostname === "localhost") {
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export { auth };
