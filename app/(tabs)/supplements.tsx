import SupplementPeriodBox from "@/components/SupplementPeriodBox";
import { PERIODS } from "@/constants";
import { ICONS } from "@/constants/icons";
import { useDailyIntake } from "@/hooks/useDailyIntake";
import { useSupplements } from "@/hooks/useSupplements";
import { FoodRelation } from "@/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import React, { useEffect } from "react";
import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const SupplementsScreen = () => {
  const { supplements, clearSupplements } = useSupplements();
  const { takenMap, setTakenForMany, toggleTaken } = useDailyIntake();

  // ALARM STATES
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showNoonTimePicker, setShowNoonTimePicker] = React.useState(false);
  const [showEveningTimePicker, setShowEveningTimePicker] = React.useState(false);

  const [morningAlarmTime, setMorningAlarmTime] = React.useState<Date | null>(null);
  const [noonAlarmTime, setNoonAlarmTime] = React.useState<Date | null>(null);
  const [eveningAlarmTime, setEveningAlarmTime] = React.useState<Date | null>(null);

  // Load saved alarm times on component mount
  useEffect(() => {
    const loadSavedAlarmTimes = async () => {
      try {
        const savedMorning = await AsyncStorage.getItem("morningAlarmTime");
        if (savedMorning) setMorningAlarmTime(new Date(savedMorning));
        const savedNoon = await AsyncStorage.getItem("noonAlarmTime");
        if (savedNoon) setNoonAlarmTime(new Date(savedNoon));
        const savedEvening = await AsyncStorage.getItem("eveningAlarmTime");
        if (savedEvening) setEveningAlarmTime(new Date(savedEvening));
      } catch (error) {
        console.error("Error loading saved alarm times:", error);
      }
    };
    loadSavedAlarmTimes();
  }, []);

  // Setup notification channel for Android (enhanced version)
  const setupNotificationChannel = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alarm', {
        name: 'Supplement Alarms',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
        enableLights: true,
        lightColor: '#36d399',
        enableVibration: true,
        showBadge: true,
      });
    }
  };

  // --- MORNING ALARM ---
  const handleSetAlarm = async () => {
    try {
      await setupNotificationChannel();
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Notification permissions are required to set an alarm. Please enable notifications in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }
      setShowTimePicker(true);
    } catch (error) {
      console.error("Error setting up alarm:", error);
      Alert.alert('Error', 'Failed to setup alarm. Please try again.');
    }
  };

  const onTimePicked = async (
    event: any,
    selectedDate?: Date
  ) => {
    setShowTimePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      setMorningAlarmTime(selectedDate);
      try {
        await AsyncStorage.setItem("morningAlarmTime", selectedDate.toISOString());
        await scheduleMorningAlarm(selectedDate);
      } catch (error) {
        console.error("Error saving alarm time:", error);
        Alert.alert('Error', 'Failed to save alarm time.');
      }
    }
  };

  const scheduleMorningAlarm = async (date: Date) => {
    try {
      // Cancel existing supplement alarms only
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      for (const notification of scheduledNotifications) {
        if (notification.content.title?.includes('morning supplements')) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }

      if (Platform.OS === 'ios') {
        // iOS supports repeating calendar trigger
        const trigger = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        };
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Time to take your morning supplements!",
            body: "Don't forget to mark them as taken.",
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            color: '#36d399',
          },
          trigger,
        });
      } else {
        // Android: use only the helper to schedule for the next 7 days
        await scheduleAndroidDailyAlarms(date, "morning supplements");
      }

      Toast.show({
        type: 'success',
        text1: 'Alarm Set!',
        text2: `${Platform.OS === 'ios' ? 'Daily' : 'Next 7 days'} morning supplement reminder set for ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        position: 'top',
      });

    } catch (error) {
      console.error('Error scheduling alarm:', error);
      Alert.alert('Error', 'Failed to schedule alarm. Please try again.');
    }
  };

  const cancelMorningAlarm = async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduledNotifications) {
      if (notification.content.title?.includes('morning supplements')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    Toast.show({
      type: 'success',
      text1: 'Alarm Cancelled!',
      text2: 'Your morning alarm has been cancelled.',
      position: 'top',
    });
    await AsyncStorage.removeItem("morningAlarmTime");
    setMorningAlarmTime(null);
  };

  // --- NOON ALARM ---
  const handleSetNoonAlarm = async () => {
    try {
      await setupNotificationChannel();
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Notification permissions are required to set an alarm. Please enable notifications in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }
      setShowNoonTimePicker(true);
    } catch (error) {
      console.error("Error setting up alarm:", error);
      Alert.alert('Error', 'Failed to setup alarm. Please try again.');
    }
  };

  const onNoonTimePicked = async (
    event: any,
    selectedDate?: Date
  ) => {
    setShowNoonTimePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      setNoonAlarmTime(selectedDate);
      try {
        await AsyncStorage.setItem("noonAlarmTime", selectedDate.toISOString());
        await scheduleNoonAlarm(selectedDate);
      } catch (error) {
        console.error("Error saving alarm time:", error);
        Alert.alert('Error', 'Failed to save alarm time.');
      }
    }
  };

  const scheduleNoonAlarm = async (date: Date) => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      for (const notification of scheduledNotifications) {
        if (notification.content.title?.includes('noon supplements')) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }

      if (Platform.OS === 'ios') {
        const trigger = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        };
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Time to take your noon supplements!",
            body: "Don't forget to mark them as taken.",
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            color: '#36d399',
          },
          trigger,
        });
      } else {
        await scheduleAndroidDailyAlarms(date, "noon supplements");
      }

      Toast.show({
        type: 'success',
        text1: 'Alarm Set!',
        text2: `${Platform.OS === 'ios' ? 'Daily' : 'Next 7 days'} noon supplement reminder set for ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        position: 'top',
      });

    } catch (error) {
      console.error('Error scheduling alarm:', error);
      Alert.alert('Error', 'Failed to schedule alarm. Please try again.');
    }
  };

  const cancelNoonAlarm = async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduledNotifications) {
      if (notification.content.title?.includes('noon supplements')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    Toast.show({
      type: 'success',
      text1: 'Alarm Cancelled!',
      text2: 'Your noon alarm has been cancelled.',
      position: 'top',
    });
    await AsyncStorage.removeItem("noonAlarmTime");
    setNoonAlarmTime(null);
  };

  // --- EVENING ALARM ---
  const handleSetEveningAlarm = async () => {
    try {
      await setupNotificationChannel();
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: false,
        },
      });
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Notification permissions are required to set an alarm. Please enable notifications in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }
      setShowEveningTimePicker(true);
    } catch (error) {
      console.error("Error setting up alarm:", error);
      Alert.alert('Error', 'Failed to setup alarm. Please try again.');
    }
  };

  const onEveningTimePicked = async (
    event: any,
    selectedDate?: Date
  ) => {
    setShowEveningTimePicker(false);
    if (selectedDate && event.type !== 'dismissed') {
      setEveningAlarmTime(selectedDate);
      try {
        await AsyncStorage.setItem("eveningAlarmTime", selectedDate.toISOString());
        await scheduleEveningAlarm(selectedDate);
      } catch (error) {
        console.error("Error saving alarm time:", error);
        Alert.alert('Error', 'Failed to save alarm time.');
      }
    }
  };

  const scheduleEveningAlarm = async (date: Date) => {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      for (const notification of scheduledNotifications) {
        if (notification.content.title?.includes('evening supplements')) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }

      if (Platform.OS === 'ios') {
        const trigger = {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour: date.getHours(),
          minute: date.getMinutes(),
          repeats: true,
        };
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Time to take your evening supplements!",
            body: "Don't forget to mark them as taken.",
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.HIGH,
            color: '#36d399',
          },
          trigger,
        });
      } else {
        await scheduleAndroidDailyAlarms(date, "evening supplements");
      }

      Toast.show({
        type: 'success',
        text1: 'Alarm Set!',
        text2: `${Platform.OS === 'ios' ? 'Daily' : 'Next 7 days'} evening supplement reminder set for ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        position: 'top',
      });

    } catch (error) {
      console.error('Error scheduling alarm:', error);
      Alert.alert('Error', 'Failed to schedule alarm. Please try again.');
    }
  };

  const cancelEveningAlarm = async () => {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    for (const notification of scheduledNotifications) {
      if (notification.content.title?.includes('evening supplements')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    Toast.show({
      type: 'success',
      text1: 'Alarm Cancelled!',
      text2: 'Your evening alarm has been cancelled.',
      position: 'top',
    });
    await AsyncStorage.removeItem("eveningAlarmTime");
    setEveningAlarmTime(null);
  };

  // Helper function to schedule multiple alarms for Android (since it doesn't support repeating calendar triggers)
  const scheduleAndroidDailyAlarms = async (date: Date, title: string) => {
    const notifications = [];
    for (let i = 0; i < 7; i++) { // Schedule for next 7 days
      const alarmTime = new Date();
      alarmTime.setHours(date.getHours());
      alarmTime.setMinutes(date.getMinutes());
      alarmTime.setSeconds(0);
      alarmTime.setMilliseconds(0);
      alarmTime.setDate(alarmTime.getDate() + i);

      // Skip if this time has already passed today (for i=0)
      if (i === 0 && alarmTime <= new Date()) {
        continue;
      }

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body: "Don't forget to mark them as taken.",
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          color: '#36d399',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: alarmTime,
          channelId: 'alarm',
        },
      });

      notifications.push(notificationId);
    }
    console.log(`Scheduled ${notifications.length} Android alarms for the next 7 days`);
    return notifications;
  };

  // Filter supplements by period and relation
  const morningBefore = supplements.filter(
    (supp) => supp.time === PERIODS[0] && supp.relation === FoodRelation.BEFORE
  );
  const morningWith = supplements.filter(
    (supp) => supp.time === PERIODS[0] && supp.relation === FoodRelation.WITH
  );
  const morningAfter = supplements.filter(
    (supp) => supp.time === PERIODS[0] && supp.relation === FoodRelation.AFTER
  );

  const noonBefore = supplements.filter(
    (supp) => supp.time === PERIODS[1] && supp.relation === FoodRelation.BEFORE
  );
  const noonWith = supplements.filter(
    (supp) => supp.time === PERIODS[1] && supp.relation === FoodRelation.WITH
  );
  const noonAfter = supplements.filter(
    (supp) => supp.time === PERIODS[1] && supp.relation === FoodRelation.AFTER
  );

  const eveningBefore = supplements.filter(
    (supp) => supp.time === PERIODS[2] && supp.relation === FoodRelation.BEFORE
  );
  const eveningWith = supplements.filter(
    (supp) => supp.time === PERIODS[2] && supp.relation === FoodRelation.WITH
  );
  const eveningAfter = supplements.filter(
    (supp) => supp.time === PERIODS[2] && supp.relation === FoodRelation.AFTER
  );

  const allMorningIds = supplements
    .filter((supp) => supp.time === PERIODS[0])
    .map((s) => s.id);
  const allNoonIds = supplements
    .filter((supp) => supp.time === PERIODS[1])
    .map((s) => s.id);
  const allEveningIds = supplements
    .filter((supp) => supp.time === PERIODS[2])
    .map((s) => s.id);

  const morningIsTaken = allMorningIds.every((id) => takenMap[id]);
  const noonIsTaken = allNoonIds.every((id) => takenMap[id]);
  const eveningIsTaken = allEveningIds.every((id) => takenMap[id]);

  // Handler for "Mark All"
  const handleAllMorning = async () => {
    await setTakenForMany(allMorningIds, !morningIsTaken);
  };

  const handleAllNoon = async () => {
    await setTakenForMany(allNoonIds, !noonIsTaken);
  };

  const handleAllEvening = async () => {
    await setTakenForMany(allEveningIds, !eveningIsTaken);
  };

  const handleRemoveAll = async () => {
    await clearSupplements();
  }

  return (
    <View className="flex-1 bg-primary">
      <View
        className="flex-1 px-3"
        style={{
          minHeight: "100%",
          paddingBottom: 10,
        }}
      >
        <Image
          source={ICONS.logo}
          className="w-16 h-16 mt-6 mx-auto animate-pulse"
        />
        <Text className="mx-auto text-white mt-4 font-bold text-xl">
          Manage Supplements
        </Text>
        <Text className="text-center text-muted text-sm">
          Mark supplements as taken by clicking on them.
        </Text>

        {/* Morning */}
        <View className="flex w-full flex-row items-center justify-between">
          <Text className=" text-accent mt-4 font-bold text-lg">Morning</Text>
          <TouchableOpacity onPress={handleAllMorning}>
            <Text className=" text-white/80 mt-4 font-bold text-lg">
              {morningIsTaken ? "Unmark All" : "Mark All"}
            </Text>
          </TouchableOpacity>
          {morningAlarmTime ? (
            <TouchableOpacity onPress={cancelMorningAlarm}>
              <Text className="text-white/80 mt-4 font-bold text-lg">
                Cancel Alarm
                {morningAlarmTime
                  ? ` (${morningAlarmTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })})`
                  : ""}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSetAlarm}>
              <Text className="text-white/80 mt-4 font-bold text-lg">
                Set Alarm        
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {showTimePicker && (
          <DateTimePicker
            value={morningAlarmTime || new Date()}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onTimePicked}
          />
        )}
        <SupplementPeriodBox
          periodBefore={morningBefore}
          periodWith={morningWith}
          periodAfter={morningAfter}
          takenMap={takenMap}
          toggleTaken={toggleTaken}
        />

        {/* Noon */}
        <View className="flex w-full flex-row items-center justify-between mt-1">
          <Text className=" text-peach mt-4 font-bold text-lg">Noon</Text>
          <TouchableOpacity onPress={handleAllNoon}>
            <Text className=" text-white/80 mt-4 font-bold text-lg">
              {noonIsTaken ? "Unmark All" : "Mark All"}
            </Text>
          </TouchableOpacity>
          {noonAlarmTime ? (
            <TouchableOpacity onPress={cancelNoonAlarm}>
              <Text className="text-white/80 mt-4 font-bold text-lg">
                Cancel Alarm
                {noonAlarmTime
                  ? ` (${noonAlarmTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })})`
                  : ""}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSetNoonAlarm}>
              <Text className="text-white/80 mt-4 font-bold text-lg">
                Set Alarm
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {showNoonTimePicker && (
          <DateTimePicker
            value={noonAlarmTime || new Date()}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onNoonTimePicked}
          />
        )}
        <SupplementPeriodBox
          periodBefore={noonBefore}
          periodWith={noonWith}
          periodAfter={noonAfter}
          takenMap={takenMap}
          toggleTaken={toggleTaken}
          period="Noon"
        />

        {/* Evening */}
        <View className="flex w-full flex-row items-center justify-between mt-1">
          <Text className=" text-night mt-4 font-bold text-lg">Evening</Text>
          <TouchableOpacity onPress={handleAllEvening}>
            <Text className=" text-white/80 mt-4 font-bold text-lg">
              {eveningIsTaken ? "Unmark All" : "Mark All"}
            </Text>
          </TouchableOpacity>
          {eveningAlarmTime ? (
            <TouchableOpacity onPress={cancelEveningAlarm}>
              <Text className="text-white/80 mt-4 font-bold text-lg">
                Cancel Alarm
                {eveningAlarmTime
                  ? ` (${eveningAlarmTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })})`
                  : ""}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSetEveningAlarm}>
              <Text className="text-white/80 mt-4 font-bold text-lg">
                Set Alarm
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {showEveningTimePicker && (
          <DateTimePicker
            value={eveningAlarmTime || new Date()}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={onEveningTimePicked}
          />
        )}
        <SupplementPeriodBox
          periodBefore={eveningBefore}
          periodWith={eveningWith}
          periodAfter={eveningAfter}
          takenMap={takenMap}
          toggleTaken={toggleTaken}
          period="Evening"
        />
        <TouchableOpacity onPress={handleRemoveAll}>

      <Text className="self-center text-center w-2/4 text-white mt-2 rounded-lg p-1" style={{borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#DA6C6C'}}>Remove All Supplements</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 16 },
  label: { marginBottom: 4, fontSize: 14, color: "#fff" },
  reasoningLabel: { marginBottom: 4, fontSize: 14, color: "#36d399" },
  inputRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  input: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 8,
  },
  aiButton: {
    marginLeft: 8,
    backgroundColor: "#36d399",
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  disabled: { opacity: 0.5 },
  suggestions: {
    backgroundColor: "#222",
    borderRadius: 6,
    maxHeight: 120,
    marginBottom: 8,
  },
  suggestionItem: { padding: 6 },
  suggestionText: { color: "#fff" },
  suggestionDosage: { color: "#aaa", fontSize: 12 },
  reasoning: {
    marginTop: 0,
    color: "#aaa",
    backgroundColor: "#222",
    padding: 8,
    borderRadius: 6,
  },
  error: {
    marginTop: 8,
    color: "#ff6b6b",
    backgroundColor: "#222",
    padding: 8,
    borderRadius: 6,
  },
  row: { flexDirection: "row", gap: 12, marginTop: 12 },
  col: { flex: 1 },
  pickerWrapper: {
    backgroundColor: "#222",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#444",
    marginBottom: 8,
  },
  picker: { color: "#fff", width: "100%" },
  addButton: {
    marginTop: 16,
    backgroundColor: "#36d399",
    padding: 14,
    borderRadius: 6,
    alignItems: "center",
  },
   addButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 16 },
});

export default SupplementsScreen;