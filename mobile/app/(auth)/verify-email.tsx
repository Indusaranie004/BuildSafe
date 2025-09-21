import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";

export default function VerifyEmail() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = async () => {
    if (!isLoaded) return;
    setError("");

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace("/(tabs)/home");
      } else {
        setError("Verification succeeded but session not found.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || "Verification failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Verify Email</Text>
        <TextInput
          label="Enter OTP"
          value={code}
          onChangeText={setCode}
          keyboardType="numeric"
          mode="outlined"
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button mode="contained" onPress={handleVerify} style={styles.button}>
          Verify
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F5F5F5" },
  card: { width: "100%", padding: 20, borderRadius: 15 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#4CAF50" },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  error: { color: "#F44336", textAlign: "center", marginBottom: 10 },
});
