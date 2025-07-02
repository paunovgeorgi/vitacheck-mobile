import { useSupplements } from "@/hooks/useSupplements"; // Import this at the top
import { getLocalDateKey } from "@/lib/utils";
import { Supplement } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export function useDailyIntake() {
    const { supplements } = useSupplements(); // Get supplements here
  const [takenMap, setTakenMap] = useState<{ [id: string]: boolean }>({});
  const [reloadFlag, setReloadFlag] = useState(0);

  const reload = useCallback(() => setReloadFlag(f => f + 1), []);

  useEffect(() => {
    (async () => {
      const todayKey = getLocalDateKey();
      const intakeRaw = await AsyncStorage.getItem('dailyIntake');
      const intake = intakeRaw ? JSON.parse(intakeRaw) : {};
      // If no snapshot for today, create it
      if (!intake[todayKey]?.supplements) {
        intake[todayKey] = {
          taken: intake[todayKey]?.taken || {},
          supplements: supplements.map(s => ({ id: s.id, name: s.name }))
        };
        await AsyncStorage.setItem('dailyIntake', JSON.stringify(intake));
      }
      setTakenMap(intake[todayKey]?.taken || {});
    })();
  }, [reloadFlag, supplements]);

  useEffect(() => {
  (async () => {
    const todayKey = getLocalDateKey();
    const intakeRaw = await AsyncStorage.getItem('dailyIntake');
    const intake = intakeRaw ? JSON.parse(intakeRaw) : {};
    if (intake[todayKey]) {
      // Always sync today's supplements array with the current supplements
      intake[todayKey].supplements = supplements.map(s => ({ id: s.id, name: s.name }));
      await AsyncStorage.setItem('dailyIntake', JSON.stringify(intake));
    }
  })();
}, [supplements]);

  const toggleTaken = async (supplementId: string, allSupplements: Supplement[]) => {
  const todayKey = getLocalDateKey();
  const intakeRaw = await AsyncStorage.getItem('dailyIntake');
  const intake = intakeRaw ? JSON.parse(intakeRaw) : {};

  // If no snapshot for today, save it
  if (!intake[todayKey]?.supplements) {
    intake[todayKey] = {
      taken: intake[todayKey]?.taken || {},
      supplements: allSupplements.map(s => ({ id: s.id, name: s.name }))
    };
  }

  const todayTaken = intake[todayKey].taken || {};
  todayTaken[supplementId] = !todayTaken[supplementId];
  intake[todayKey].taken = todayTaken;

  await AsyncStorage.setItem('dailyIntake', JSON.stringify(intake));
  setTakenMap({ ...todayTaken });
  reload();
};

 const setTakenForMany = async (ids: string[], value: boolean) => {
    const todayKey = getLocalDateKey();
    const intakeRaw = await AsyncStorage.getItem('dailyIntake');
    const intake = intakeRaw ? JSON.parse(intakeRaw) : {};
    if (!intake[todayKey]?.taken) intake[todayKey] = { taken: {}, supplements: [] };
    ids.forEach(id => {
      intake[todayKey].taken[id] = value;
    });
    await AsyncStorage.setItem('dailyIntake', JSON.stringify(intake));
    setTakenMap({ ...intake[todayKey].taken });
    reload();
  };

  return { takenMap, toggleTaken, setTakenForMany, reload };
}

export async function getAllDailyIntake() {
  const intakeRaw = await AsyncStorage.getItem('dailyIntake');
  return intakeRaw ? JSON.parse(intakeRaw) : {};
}