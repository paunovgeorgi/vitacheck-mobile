import SafeScreen from "@/components/SafeScreen";
import { SupplementContextProvider } from "@/context/SupplementContext";
import * as Notifications from "expo-notifications";
import { Slot } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import "./globals.css";

// Custom toast configuration
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: "#00C851",
        backgroundColor: "#1a1a1a",
        borderRadius: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}
      text2Style={{ fontSize: 12, color: "#cccccc" }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#ff4444",
        backgroundColor: "#1a1a1a",
        borderRadius: 8,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 14, fontWeight: "600", color: "#ffffff" }}
      text2Style={{ fontSize: 12, color: "#cccccc" }}
    />
  ),
};

export default function RootLayout() {
  // Set notification handler globally
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Setup notification channels
  useEffect(() => {
    const setupNotificationChannels = async () => {
      if (Platform.OS === 'android') {
        // Default channel
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default notifications",
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          enableVibration: true,
        });

        // Alarm channel (for supplement reminders)
        await Notifications.setNotificationChannelAsync("alarm", {
          name: "Supplement Alarms",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
          enableLights: true,
          lightColor: '#36d399',
          enableVibration: true,
          showBadge: true,
        });

        console.log('Notification channels set up successfully');
      }
    };

    setupNotificationChannels();
  }, []);

  return (
    <SupplementContextProvider>
      <SafeScreen>
        <Slot />
        <Toast config={toastConfig} />
      </SafeScreen>
    </SupplementContextProvider>
  );
}