import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, Card } from "react-native-paper";
import { useRouter } from "expo-router";

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(""); 
  const router = useRouter();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    setError("");
    if (!email || !password) return setError("Enter email and password");

    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      router.replace("/(tabs)/home");
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || "Sign in failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>

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

        <Button mode="contained" onPress={handleSignIn} style={styles.button}>
          Sign In
        </Button>

        <Text style={styles.link} onPress={() => router.push("/(auth)/sign-up")}>
          New here? Create Account
        </Text>
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
  link: { textAlign: "center", marginTop: 15, color: "#007BFF", textDecorationLine: "underline" },
  error: { color: "#F44336", marginBottom: 15, textAlign: "center" },
});
