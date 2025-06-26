
import { createSupplementInterface, Supplement } from "@/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from "react";
import uuid from 'react-native-uuid';


interface SupplementContextType {
    supplements: Supplement[];
    isLoading: boolean;
    error: string | null;
    addSupplement: (supplement: createSupplementInterface) => Promise<boolean>;
    removeSupplement: (supplementId: string) => Promise<void>;
    refreshSupplements: () => Promise<void>;
    clearSupplements: () => Promise<void>;
}

const SupplementContext = createContext<SupplementContextType | undefined>(undefined);

export function SupplementContextProvider({ children }: { children: React.ReactNode }) {
    const [supplements, setSupplements] = useState<Supplement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
   
    const refreshSupplements = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const storedSupplements = await AsyncStorage.getItem('supplements');
            if (storedSupplements) {
                setSupplements(JSON.parse(storedSupplements));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load supplements');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        refreshSupplements();
    }, []);

   const addSupplement = async (supplement: createSupplementInterface) => {
    
  try {
    setError(null);
    if (supplements.some(sup => sup.name === supplement.name && sup.time === supplement.time)) {
      setError('This supplement already exists for the selected time.');
      return false;
    }
    
    const suppId = uuid.v4();
    
    const supplementWithId = { ...supplement, id: suppId };
    const newSupplements = [...supplements, supplementWithId];
    setSupplements(newSupplements);
    await saveSupplements(newSupplements);
    setError(null);
    return true;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to add supplement');
    throw err;
  }
};

    const removeSupplement = async (supplementId: string) => {
    const newSupplements = supplements.filter(sup => sup.id !== supplementId);
    setSupplements(newSupplements);
    await saveSupplements(newSupplements);
  };


      const saveSupplements = async (newSupplements: Supplement[]) => {
    try {
      await AsyncStorage.setItem('supplements', JSON.stringify(newSupplements));
    } catch (error) {
      console.error('Error saving supplements:', error);
    }
  };

    const clearSupplements = async (): Promise<void> => {
        setSupplements([]);
        try {
            await AsyncStorage.setItem('supplements', JSON.stringify([]));
        } catch (error) {
            console.error('Error clearing supplements:', error);
            setError('Failed to clear supplements');
    }
    };

    const value: SupplementContextType = {
        supplements,
        isLoading,
        error,
        addSupplement,
        removeSupplement,
        refreshSupplements,
        clearSupplements
    };

    return (
        <SupplementContext.Provider value={value}>
            {children}
        </SupplementContext.Provider>
    );
}

export default SupplementContext;