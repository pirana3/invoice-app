import { Text, View, Modal, Pressable } from 'react-native';
import React, {useRef} from 'react'
import Signature from 'react-native-signature-canvas';

const signature = ({visible, onClose, onSave}) => {
    const ref = useRef();

    const handleOK = (siganture) => {
        onSave(signature);
        onClose();
    };

    return (
    <Modal visible={visible} animationType="slide">
        <View className="flex-1">
            <Signature
                ref={ref}
                onOK={handleOK}
                desription="Sign here"
            />
            <Pressable
                title="Save Signature"
                onPress={() => ref.current.readSignature()}
            />
            <Pressable
                title="Cancel"
                onPress={onClose}
            />
        </View>
    </Modal>
  )
}

export default signature
