import { getApp, getApps, initializeApp } from "firebase/app";
import {
  connectAuthEmulator,
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { clientConfig } from "@/config/client-config";

export const getFirebaseApp = () => {
  if (getApps().length) {
    return getApp();
  }

  const app = initializeApp(clientConfig);

  return app;
};

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp());

  // App relies only on server token. We make sure Firebase does not store credentials in the browser.
  // See: https://github.com/awinogrodzki/next-firebase-auth-edge/issues/143
  void setPersistence(auth, inMemoryPersistence);

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_EMULATOR_HOST, {
      disableWarnings: true,
    });
  }

  return auth;
}

export function getFirebaseFirestore() {
  const firestore = getFirestore(getFirebaseApp());

  if (process.env.NEXT_PUBLIC_EMULATOR_HOST) {
    // https://stackoverflow.com/questions/73605307/firebase-auth-emulator-fails-intermittently-with-auth-emulator-config-failed
    connectFirestoreEmulator(
      firestore,
      process.env.NEXT_PUBLIC_EMULATOR_HOST,
      8080,
    );
  }

  return firestore;
}
