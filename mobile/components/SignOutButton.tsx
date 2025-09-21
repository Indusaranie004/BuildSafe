// components/SignOutButton.tsx
import { useClerk } from '@clerk/clerk-expo';
import { Button } from 'react-native';

export default function SignOutButton() {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    try {
      await signOut();
      // Redirect to the sign-in page
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  return <Button title="Sign Out" onPress={handleSignOut} />;
}
