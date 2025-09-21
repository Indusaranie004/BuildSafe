// app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";
import { CLERK_PUBLISHABLE_KEY } from "../config";

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
      <Slot /> {/* Expo Router mounts children layouts here */}
    </ClerkProvider>
  );
}
