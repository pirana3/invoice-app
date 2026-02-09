import { StyleSheet, Text, View, Pressable, useWindowDimensions } from 'react-native';
import { TabView,  SceneMap} from 'react-native-tab-view';
import {useState, useEffect} from 'react';
import { Slot, usePathname, router } from 'expo-router';
import React from 'react'

const routes = [
  {key: 'buisness', title: 'Buisness', path: '/profile/business'},
  {key: 'employees', title: 'Employees', path: '/profile/employees'}
];


export default function profileTabs () {
  const layout = useWindowDimensions();

  
}

const styles = StyleSheet.create({})