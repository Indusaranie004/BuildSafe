import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SignUp() {
  const { signUp, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    if (!isLoaded) return;
    setError("");
    if (!email || !password) return setError("Please enter email and password");

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      router.push("/(auth)/verify-email");
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || "Sign up failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          mode="outlined"
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button mode="contained" onPress={handleSignUp} style={styles.button}>
          Sign Up
        </Button>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#F5F5F5" },
  card: { width: "100%", padding: 20, borderRadius: 15 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#4CAF50" },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
  error: { color: "#F44336", textAlign: "center", marginBottom: 10 },
});
