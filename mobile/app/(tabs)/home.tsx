import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import { useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function Home() {
  const { signOut, userId } = useAuth();
  const router = useRouter();

  const sections = [
    { title: "Assessment ", color: "#FFCDD2" },
    { title: "Compliance ", color: "#C8E6C9" },
    { title: "Risk Scoring Engine", color: "#BBDEFB" },
    { title: "AI Recommendation", color: "#FFF9C4" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Welcome SafeBuild</Text>
        <Button mode="contained" onPress={async () => { await signOut(); router.replace("/(auth)/sign-in"); }}>
          Logout
        </Button>
      </View>

      {sections.map((section) => (
        <Card key={section.title} style={[styles.card, { backgroundColor: section.color }]}>
          <Card.Title title={section.title} />
          <Card.Content>
            <Text>Click to manage {section.title.toLowerCase()}.</Text>
          </Card.Content>
          <Card.Actions>
            <Button>Open</Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  welcome: { fontSize: 18, fontWeight: "bold" },
  card: { marginBottom: 15, borderRadius: 10 },
});
