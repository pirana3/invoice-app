import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "@/database/db";
import './global.css';

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="products/productScreen" options={{ title: "New Product" }} />
        <Stack.Screen name="products/[id]" options={{ title: "Product" }} />
      </Stack>
    </SafeAreaProvider>

  );
}
