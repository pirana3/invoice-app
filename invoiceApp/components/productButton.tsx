import { Text, View, Pressable, ActivityIndicator, Image } from "react-native";
import { productButtonProps } from "@/type";
import React from "react";
import { icons } from "@/constants/icons";
import cn from "clsx";

const ProductButton = ({
  onPress,
  title = "Add Item",
  style,
  textStyle,
  isLoading = false,
  icon,
}: productButtonProps) => {
  return (
    <Pressable className={cn("product-btn", style)} onPress={onPress}>
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

export default ProductButton;
