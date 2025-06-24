import { Slot, Stack } from "expo-router";
import './globals.css';
import SafeScreen from "@/components/SafeScreen";

export default function RootLayout() {
  return (
    <SafeScreen>
      <Slot />
    </SafeScreen>
  );
}
