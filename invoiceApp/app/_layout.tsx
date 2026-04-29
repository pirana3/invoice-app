import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initDatabase } from "@/database/db";
import { LanguageProvider } from "@/service/language";
import './global.css';

export default function RootLayout() {
  initDatabase();

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerBackTitle: "Back" }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="startScreen/chooseLanguage" options={{ title: "Choose Language" }} />
          <Stack.Screen name="startScreen/companyDetail" options={{ title: "Company Info" }} />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="employees/[id]" options={{ title: "Employee", href: null }} />
          <Stack.Screen name="products/[id]" options={{ title: "Product" }} />
          <Stack.Screen name="customers/addCustomer" options={{ title: "Customers", href: null }} />
        </Stack>
      </SafeAreaProvider>
    </LanguageProvider>

  );
}
