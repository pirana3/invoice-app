import { Text, View, Pressable, ActivityIndicator, Image } from 'react-native';
import { businessInfoButtonProps} from "@/type";
import React from 'react';
import { icons } from "@/constants/icons";
import cn from "clsx";

const BusinessinfoButton = ({
    onPress,
    title = "Add Info",
    style,
    textStyle,
    isLoading = false,
    icon,
}: businessInfoButtonProps) => {   
  return (
    <Pressable className={cn("businessinfo-btn", style)} onPress={onPress}>
        <Image source={icon || icons.add} resizeMode="contain" className="size-5" />

        <View>
            {isLoading ? (
                <ActivityIndicator size="small" color="white" />
            ) : (
                <Text className={cn("text-white-100", textStyle)}>{title}</Text>
            )}
        </View>
    </Pressable>
  );
};

export default BusinessinfoButton