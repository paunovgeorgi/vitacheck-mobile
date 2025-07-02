import { FoodRelation, Supplement } from '@/types';
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import SupplementPeriodBoxItem from './SupplementPeriodBoxItem';

interface SupplementPeriodBoxProps {
    periodBefore: Supplement[];
    periodWith: Supplement[];
    periodAfter: Supplement[];
    takenMap: any; 
    toggleTaken: any;
    period?: string;
}

const SupplementPeriodBox = ({periodBefore, periodWith, periodAfter, takenMap, toggleTaken, period} : SupplementPeriodBoxProps) => {

    const [showRelation, setShowRelation] = useState(FoodRelation.BEFORE);

    const notTakenIds = Object.keys(takenMap).filter(id => takenMap[id] === false);
    const beforeNotTaken = periodBefore.some(supp => notTakenIds.includes(supp.id));
    const withNotTaken = periodWith.some(supp => notTakenIds.includes(supp.id));
    const afterNotTaken = periodAfter.some(supp => notTakenIds.includes(supp.id));

    const periodColor = period === 'Noon' ? 'bg-peach/20' : 'bg-night/20';
    const selectedClass = period ? `text-white p-2 ${periodColor} rounded-md border border-accent/20 min-w-[106px]` :'text-white p-2 bg-accent/20 rounded-md border border-accent/20 min-w-[106px]';

  return (
      <View className='flex flex-row border border-muted shadow shadow-accent gap-4 rounded-md h-[116px]'>
                    <View className='flex items-start py-2 h-full  justify-between'>
                      <TouchableOpacity onPress={() => setShowRelation(FoodRelation.BEFORE)}>
                      <Text className={showRelation === FoodRelation.BEFORE ? selectedClass : 'text-white p-2' }>{beforeNotTaken ? 'Before Eating*' : 'Before Eating'}</Text>
                      </TouchableOpacity>  
                      <TouchableOpacity onPress={() => setShowRelation(FoodRelation.WITH)}>
                      <Text className={showRelation === FoodRelation.WITH ? selectedClass : 'text-white p-2' }>{withNotTaken ? 'With Food*' : 'With Food'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setShowRelation(FoodRelation.AFTER)}>
                      <Text className={showRelation === FoodRelation.AFTER ? selectedClass : 'text-white p-2' }>{afterNotTaken ? 'After Eating*' : 'After Eating'}</Text>
                      </TouchableOpacity>
                    </View>

                        <View className='flex h-full'>
                      {showRelation === FoodRelation.BEFORE && periodBefore && periodBefore.length > 0 && (
                              <FlatList
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                data={periodBefore}
                                keyExtractor={item => item.name}
                                contentContainerStyle={{padding: 4}}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                  <TouchableOpacity  style={styles.suggestionItem}>
                                    <SupplementPeriodBoxItem item={item} takenMap={takenMap} toggleTaken={toggleTaken}/>
                                  </TouchableOpacity>
                                )}
                              />
                            )}
                        
                      {showRelation === FoodRelation.WITH && periodWith && periodWith.length > 0 && (
                              <FlatList
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                data={periodWith}
                                keyExtractor={item => item.name}
                                contentContainerStyle={{padding: 4}}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                  <TouchableOpacity  style={styles.suggestionItem}>
                                    <SupplementPeriodBoxItem item={item} takenMap={takenMap} toggleTaken={toggleTaken}/>
                                  </TouchableOpacity>
                                )}
                              />
                            )}
    
                      {showRelation === FoodRelation.AFTER && periodAfter && periodAfter.length > 0 && (
                              <FlatList
                                horizontal={false}
                                showsHorizontalScrollIndicator={false}
                                data={periodAfter}
                                keyExtractor={item => item.name}
                                contentContainerStyle={{padding: 4}}
                                keyboardShouldPersistTaps="handled"
                                renderItem={({ item }) => (
                                  <TouchableOpacity  style={styles.suggestionItem}>
                                    <SupplementPeriodBoxItem item={item} takenMap={takenMap} toggleTaken={toggleTaken}/>
                                  </TouchableOpacity>
                                )}
                              />
                            )}
                        </View>
                 </View>
  )
}

const styles = StyleSheet.create({
  container: { margin: 16 },
  label: { marginBottom: 4, fontSize: 14, color: '#fff' },
  reasoningLabel: { marginBottom: 4, fontSize: 14, color: '#36d399' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', borderRadius: 6, padding: 10, borderWidth: 1, borderColor: '#444', marginBottom: 8 },
  aiButton: { marginLeft: 8, backgroundColor: '#36d399', padding: 10, borderRadius: 6, marginBottom: 8},
  disabled: { opacity: 0.5 },
  suggestions: { backgroundColor: '#222', borderRadius: 6, maxHeight: 120, marginBottom: 8 },
  suggestionItem: { padding: 0 },
  suggestionText: { color: '#fff' },
  suggestionDosage: { color: '#aaa', fontSize: 12 },
  reasoning: { marginTop: 0, color: '#aaa', backgroundColor: '#222', padding: 8, borderRadius: 6 },
  error: { marginTop: 8, color: '#ff6b6b', backgroundColor: '#222', padding: 8, borderRadius: 6 },
  row: { flexDirection: 'row', gap: 12, marginTop: 12 },
  col: { flex: 1 },
  pickerWrapper: { backgroundColor: '#222', borderRadius: 6, borderWidth: 1, borderColor: '#444', marginBottom: 8 },
  picker: { color: '#fff', width: '100%' },
  addButton: { marginTop: 16, backgroundColor: '#36d399', padding: 14, borderRadius: 6, alignItems: 'center' },
  addButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
  testContainer: {height: 200}
});

export default SupplementPeriodBox