import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Tab = createMaterialTopTabNavigator();
const TopTabs = withLayoutContext(Tab.Navigator);

export default function ProfileLayout() {
  const insets = useSafeAreaInsets();

  return (
    <TopTabs
      screenOptions={{
        tabBarIndicatorStyle: { backgroundColor: "#000" },
        tabBarStyle: {
          backgroundColor: "#fff",
          paddingTop: insets.top,
          height: 48 + insets.top,
        },
      }}
    >
      <TopTabs.Screen name="index" options={{ title: "Invoice" }} />
      <TopTabs.Screen name="invoiceCreate" options={{ href: null, title: 'Create Invoice' }} />

    </TopTabs>
  );
}
