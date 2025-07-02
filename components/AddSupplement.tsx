import { commonSupplements } from '@/constants/supplements';
import { useFilteredSuggestions } from '@/hooks/useFilteredSuggestions';
import { useSupplements } from '@/hooks/useSupplements';
import { categorizeSupplement } from '@/services/supplementsAPI';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';

const TIME_OPTIONS = [
  { label: 'Morning', value: 'Morning' },
  { label: 'Noon', value: 'Noon' },
  { label: 'Evening', value: 'Evening' },
];

const RELATION_OPTIONS = [
  { label: 'Before Eating', value: 'Before Eating' },
  { label: 'With Food', value: 'With Food' },
  { label: 'After Eating', value: 'After Eating' },
];

const AddSupplement = () => {
  const { addSupplement} = useSupplements();

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [reasoning, setReasoning] = useState('');
  const [relation, setRelation] = useState(RELATION_OPTIONS[0].value);
  const [time, setTime] = useState(TIME_OPTIONS[0].value);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const { suggestions, showSuggestions, setShowSuggestions } = useFilteredSuggestions(name, commonSupplements);

  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setReasoning('');
    setError('');
  }, [name]);

  const handleSelectSuggestion = (supp: any) => {
    setName(supp.name);
    setDosage(supp.dosage);
    Keyboard.dismiss();
    setTimeout(() => setShowSuggestions(false), 100);  
};

  const handleAiSuggestion = async () => {
    if (!name.trim()) return;
    setIsCategorizing(true);
    setReasoning('');
    try {
      setError('');
      const data = await categorizeSupplement(name);
      setReasoning(data.reasoning || '');
      setRelation(data.suggestedMealCategory || RELATION_OPTIONS[0].value);
      setTime(data.suggestedTimeCategory || TIME_OPTIONS[0].value); 

    } catch (err) {
      setError('Unable to provide AI reasoning at the moment. Please try again later.');
    } finally {
      setIsCategorizing(false);
    }
  };

  const handleAdd = async () => {
  if (!name) return;
  try {
    setIsAdding(true);
    
    const success = await addSupplement({
      name,
      dosage,
      reasoning,
      relation,
      time,
    });
    if (!success) {
      // setError('This supplement already exists for the selected time.');
      Toast.show({
        type: 'error',
        text1: 'Duplicate',
        text2: 'This supplement already exists for the selected time.',
        position: 'top',
      });
      setIsAdding(false);
      return;
    }
    setName('');
    setDosage('');
    setReasoning('');
    
    Toast.show({
      type: 'success',
      text1: 'Success',
      text2: `${name} has been added to your supplements.`,
      position: 'top',
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'Could not add supplement. Please try again. FFS',
      position: 'top',
    });
  }
  setIsAdding(false);
};

  const handleOnNameChange = (text: string) => {
    setName(text);
    setDosage('');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Supplement Name</Text>
      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          value={name}
          onChangeText={handleOnNameChange}
          onFocus={() => setShowSuggestions(true)}
          style={styles.input}
          placeholder="e.g., Vitamin D3"
          placeholderTextColor="#99a1af"
        />
        <TouchableOpacity
          onPress={handleAiSuggestion}
          disabled={isCategorizing || name.length === 0 || reasoning.length > 0}
          style={[styles.aiButton, (isCategorizing || name.length === 0 || reasoning.length > 0) && styles.disabled]}
        >
          {isCategorizing ? <ActivityIndicator color="#fff" /> : <Ionicons name='sparkles-outline' size={20} color='white'/>}
        </TouchableOpacity>
      </View>
      {showSuggestions && suggestions.length > 0 && (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={suggestions}
          keyExtractor={item => item.name}
          style={styles.suggestions}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectSuggestion(item)} style={styles.suggestionItem}>
              <Text style={styles.suggestionText} className='bg-primary/80 px-4 py-2 rounded-xl border border-accent/60'>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Text style={styles.label}>Dosage</Text>
      <TextInput
        value={dosage}
        onChangeText={setDosage}
        style={styles.input}
        placeholder="e.g., 1000 IU"
        placeholderTextColor="#99a1af"
      />
      {reasoning ? (
        <View >
        <Text style={styles.reasoningLabel}>AI Reasoning</Text>
        <Text style={styles.reasoning}>{reasoning}</Text>
        </View>
      ) : null}
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Time of Day</Text>
          <View style={styles.pickerWrapper}>
            {/* <Picker
              selectedValue={time}
              onValueChange={setTime}
              style={styles.picker}
              dropdownIconColor="#36d399"
              dropdownIconRippleColor='#36d399'
            >
              {TIME_OPTIONS.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker> */}
            <Dropdown
  style={{
    height: 50,
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#1a1a1a',
  }}

  // This styles the text on the select button itself
  selectedTextStyle={{
    color: '#ffffff', // This sets the color of the selected text
    fontSize: 16,
  }}
  // This styles the dropdown container
  containerStyle={{
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderColor: '#36d399',
    borderWidth: 1,
  }}
  // This styles each item in the dropdown
  itemTextStyle={{
    color: '#ffffff',
    fontSize: 16,
  }}

   placeholderStyle={{
    color: 'white', // Placeholder text color
    fontSize: 16,
  }}

  // This styles the selected item
  activeColor="#36d399"
  iconColor='#36d399'
  data={TIME_OPTIONS}
  maxHeight={300}
  labelField="label"
  valueField="value"
  placeholder="Select time..."
  value={time}
  onChange={item => setTime(item.value)}
/>
          </View>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Relation to Food</Text>
          <View style={styles.pickerWrapper}>
            {/* <Picker
              selectedValue={relation}
              onValueChange={setRelation}
              style={styles.picker}
              dropdownIconColor="#36d399"
              dropdownIconRippleColor='#36d399'
            >
              {RELATION_OPTIONS.map(opt => (
                <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </Picker> */}
            <Dropdown
  style={{
    height: 50,
    borderColor: '#222',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#1a1a1a',
  }}

  // This styles the text on the select button itself
  selectedTextStyle={{
    color: '#ffffff', // This sets the color of the selected text
    fontSize: 16,
  }}
  // This styles the dropdown container
  containerStyle={{
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderColor: '#36d399',
    borderWidth: 1,
  }}
  // This styles each item in the dropdown
  itemTextStyle={{
    color: '#ffffff',
    fontSize: 16,
  }}

  //  placeholderStyle={{
  //   color: 'white', // Placeholder text color
  //   fontSize: 16,
  // }}

  // This styles the selected item
  activeColor="#36d399"
  iconColor='#36d399'
  data={RELATION_OPTIONS}
  maxHeight={300}
  labelField="label"
  valueField="value"
  placeholder="Select relation..."
  value={relation}
  onChange={item => setRelation(item.value)}
/>
          </View>
        </View>
      </View>
      <TouchableOpacity
        disabled={!name}
        onPress={handleAdd}
        style={[styles.addButton, !name && styles.disabled]}
      >
        {isAdding ? <ActivityIndicator color="#fff" /> : <Text style={styles.addButtonText}>Add Supplement</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 16 },
  label: { marginBottom: 4, fontSize: 14, color: '#fff' },
  reasoningLabel: { marginBottom: 4, fontSize: 14, color: '#36d399' },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  input: { flex: 1, backgroundColor: '#222', color: '#fff', borderRadius: 6, padding: 10, borderWidth: 1, borderColor: '#444', marginBottom: 8 },
  aiButton: { marginLeft: 8, backgroundColor: '#36d399', padding: 10, borderRadius: 6, marginBottom: 8},
  disabled: { opacity: 0.5 },
  suggestions: { backgroundColor: '#222', borderRadius: 6, maxHeight: 120, marginBottom: 8 },
  suggestionItem: { padding: 6 },
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
});

export default AddSupplement;