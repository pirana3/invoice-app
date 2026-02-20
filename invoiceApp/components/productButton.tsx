import { StyleSheet, Text, View, Pressable, ActivityIndicator } from 'react-native'
import {productButtonProps} from "@/type";
import React from 'react'
import cn from "clsx";

const productButton = ({
    onPress,
    title="Add Item",
    style, 
    textStyle,
    leftIcon,
    isLoading = false
}: productButtonProps) => {
    return(
        <Pressable className={cn('product-btn', style)} onPress={onPress}>
            

        </Pressable>
    )
}
