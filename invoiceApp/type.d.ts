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

interface employeeButtonProps {
    onPress?: () => void
    title?: string;
    style?: string;
    icon?: any;
    employeeIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    icon?: any;
}

interface projectButtonProps{
    onPress?: () => void;
    title?: string;
    style?: string;
    icon?: any;
    projectIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    icon?: any;
}

interface documentsButtonProps{
    onPress?: () => void;
    title?: string;
    style?: string;
    icon?: any;
    documentsIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    icon?: any;
}

interface businessInfoButtonProps{
    onPress?: () => void;
    title?: string;
    style?: string;
    icon?: any;
    businessInfoIcon?: React.ReactNode;
    textStyle?: string;
    isLoading?: boolean;
    icon?: any;
}