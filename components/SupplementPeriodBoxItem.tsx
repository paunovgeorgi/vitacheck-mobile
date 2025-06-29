import { useSupplements } from "@/hooks/useSupplements";
import { Supplement } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = { item: Supplement, takenMap: any, toggleTaken: any };

const SupplementPeriodBoxItem = ({ item, takenMap, toggleTaken }: Props) => {

  const { supplements } = useSupplements();
  // const { takenMap, toggleTaken } = useDailyIntake();
  const [modalVisible, setModalVisible] = useState(false);
  const { removeSupplement } = useSupplements();

  const handleRemoveItem = async () => {
    await removeSupplement(item.id);
  };

  return (
    <>
      <View className="flex flex-row justify-between items-center gap-4">
        <TouchableOpacity onPress={() => toggleTaken(item.id, supplements)}>
          <Text
            className={`text-white w-[124px] px-2 py-2 text-center rounded-xl border border-accent/60 ${
              takenMap[item.id] ? "bg-accent/80" : "bg-primary/80"
            }`}
          >
            {item.name.length > 11 ? item.name.slice(0, 11) + "…" : item.name}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons
            name="information-circle-outline"
            size={26}
            color="#AFDDFF90"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRemoveItem}>
          <Ionicons name="remove-circle-outline" size={22} color="#DA6C6C" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View className="flex rounded-xl shadow-xl  shadow-accent w-[300px] p-4 bg-background/90">
            <Text className="text-white text-center mb-2 font-bold text-xl">
              {item.name}
            </Text>
            <Text className="text-accent font-bold">Dosage</Text>
            <Text className="text-sm text-white/80">{item.dosage}</Text>
            <Text className="text-accent font-bold mt-2">AI Reasoning</Text>
            <Text className="text-sm text-white/80">
              {item.reasoning || "No reasoning provided."}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="self-center rounded-lg py-2 px-5 mt-5 bg-accent/90"
            >
              <Text className="font-bold text-white">CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#222",
    padding: 24,
    borderRadius: 12,
    width: 300,
    // alignItems: 'center',
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 12,
  },
  label: {
    color: "#AFDDFF",
    fontWeight: "600",
    marginTop: 8,
  },
  value: {
    color: "#fff",
    fontWeight: "400",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#AFDDFF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
    alignSelf: "center",
  },
  closeText: {
    color: "#222",
    fontWeight: "bold",
  },
});

export default SupplementPeriodBoxItem;
