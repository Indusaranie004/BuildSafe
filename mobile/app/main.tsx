// mobile/app/main.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

export default function MainScreen() {
  const { signOut } = useClerk();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/'); // Redirect to sign-in
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to SafeBuild!</Text>
      <Button title="Sign Out" onPress={handleSignOut} />
    </View>
  );
}
