import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function TabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger
        name="(profile)"
        options={{
          title: "Profile",
        }}
      />

      <NativeTabs.Trigger
        name="(invoice)"
        options={{
          title: "Invoice",
        }}
      />

      <NativeTabs.Trigger
        name="(estimate)"
        options={{
          title: "Estimate",
        }}
      />

      <NativeTabs.Trigger
        name="(stats)"
        options={{
          title: "Stats",
        }}
      />
      <NativeTabs.Trigger
        name="(customers)"
        options={{
          title: "Customers",
        }}
      />
    </NativeTabs>
  );
}
