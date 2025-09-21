// app/(tabs)/_layout.tsx
import { Stack, Redirect } from "expo-router";
import { SignedIn, SignedOut } from "@clerk/clerk-expo";

export default function TabsLayout() {
  return (
    <>
      <SignedIn>
        <Stack screenOptions={{ headerShown: false }} />
      </SignedIn>

      <SignedOut>
        <Redirect href="/(auth)/sign-in" />
      </SignedOut>
    </>
  );
}
