import {Models} from "react-native-appwrite"
interface productButtonProps{
    onPress?: () => void
    title?: string;
    style?: string;
    productIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    icon?: any;
}