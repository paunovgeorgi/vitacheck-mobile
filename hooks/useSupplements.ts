import SupplementContext from "@/context/SupplementContext";
import { useContext } from "react";

export function useSupplements() {
    const context = useContext(SupplementContext);
    if (context === undefined) {
        throw new Error('useSupplements must be used within a SupplementContextProvider');
    }
    return context;
}