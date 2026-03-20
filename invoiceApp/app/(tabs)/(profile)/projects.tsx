import { StyleSheet, Text, View } from 'react-native';
import ProjectButton from '@/components/ProjectButton';
import React from 'react'

// we can move this to customers since it make more sense to have it there next to them so gives more space and makes it less cramped in profile 
const projects = () => {
  return (
    <View>
      <Text>projects</Text>
      <ProjectButton/>
    </View>
  )
}

export default projects

const styles = StyleSheet.create({})