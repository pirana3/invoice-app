import { Text, View, ScrollView, Pressable, Modal } from 'react-native'
import React, {useState} from 'react'

const ePositionModal = () => {
  return (
    <View>
        <Modal animationType="slide" transparent={true} visible={isVisible}>
            <View></View>
        </Modal>
    </View>
  )
}

export default ePositionModal
