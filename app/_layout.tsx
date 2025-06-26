import SafeScreen from "@/components/SafeScreen";
import { SupplementContextProvider } from "@/context/SupplementContext";
import { Slot } from "expo-router";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import './globals.css';

// Custom toast configuration
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#00C851', // Green border
        backgroundColor: '#1a1a1a', // Dark background
        borderRadius: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff', // White text
      }}
      text2Style={{
        fontSize: 12,
        color: '#cccccc', // Light gray text
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ff4444', // Red border
        backgroundColor: '#1a1a1a', // Dark background
        borderRadius: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '600',
        color: '#ffffff', // White text
      }}
      text2Style={{
        fontSize: 12,
        color: '#cccccc', // Light gray text
      }}
    />
  ),
};

export default function RootLayout() {
  return (
    <SupplementContextProvider>
    <SafeScreen>
      <Slot />
      <Toast config={toastConfig} />
    </SafeScreen>
    </SupplementContextProvider>
  );
}
