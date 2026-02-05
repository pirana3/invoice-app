import { Tabs } from 'expo-router'
import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

export  default function TabsLayout() {
  return (
    <Tabs>
        <Tabs.Screen
        name = "index"
        options={{
            title: "Profile",
            
            
        }}
        />

        <Tabs.Screen
        name = "invoices"
        options={{
            title: "Invoice",
            
        }}
        />

        <Tabs.Screen
        name = "estimate"
        options={{
            title: "Estimate",
            
        }}
        />

        <Tabs.Screen
        name = "stats"
        options={{
            title: "Stats",
            
        }}
        />
        <Tabs.Screen
        name = "customers"
        options={{
            title: "Customers",
            
        }}
        />

    </Tabs>
  );
}

