import { Text, View, Pressable, ActivityIndicator, Image } from 'react-native';
import { employeeButtonProps } from '@/type';
import React from 'react';
import { icons } from '@/constants/icons';
import cn from "clsx";

const EmployeeButton = ({
    onPress,
    title = "Add Employee",
    style,
    textStyle,
    isLoading = false,
    icon,
}: employeeButtonProps) => {
  return (
    <Pressable className={cn("employee-btn", style)} onPress={onPress}>
        <Image source={icon || icons.add} resizeMode="contain" className="size-5"/>
        <View>
            {isLoading ? (
                <ActivityIndicator size="small" color="white"/>
            ) : (
                <Text className={cn("text-white-100", textStyle)}>{title}</Text>
            )}
        </View>
    </Pressable>
  )
}

export default EmployeeButton
