import React, { useState } from 'react';
import { StyleSheet, Alert, View, Text, Button, TouchableOpacity } from 'react-native';
import WheelPicker from 'react-native-wheel-picker-expo';
import axios from 'axios';
import { io } from 'socket.io-client';

// Initialize Socket.IO
const socket = io('http://localhost:3000'); // Replace with your backend's URL if deployed

type ItemType = { label: string; value: string };

export default function TabOneScreen() {
  const [hour, setHour] = useState(3);
  const [minute, setMinute] = useState(23);
  const [amPm, setAmPm] = useState('PM');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [isOnce, setIsOnce] = useState(false); // Track if the "Once" button is pressed

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const setAlarm = async () => {
    try {
      const response = await axios.post('', {
        hour,
        minute,
        amPm,
        days: isOnce ? ['Once'] : selectedDays, // Use "Once" if isOnce is true
        repeating: !isOnce, // Set repeating flag based on "Once" state
      });
      const dayText = isOnce ? 'Once' : selectedDays.join(', ');
      Alert.alert('Alarm Set', `Alarm set for ${hour}:${minute < 10 ? `0${minute}` : minute} ${amPm} on ${dayText}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to set alarm.');
    }
  };

  const activateServo = async () => {
    try {
      const response = await axios.post('');
      Alert.alert('Servo Activated', response.data.message);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to activate servo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Alarm Time</Text>
      <View style={styles.row}>
        <View style={styles.pickerContainer}>
          <WheelPicker
            items={Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))} 
            onChange={({ item }: { item: ItemType }) => setHour(parseInt(item.value, 10))}
          />
        </View>
        <View style={styles.colonContainer}>
          <Text style={styles.colon}>:</Text>
        </View>
        <View style={styles.pickerContainer}>
          <WheelPicker
            items={Array.from({ length: 60 }, (_, i) => ({ label: i < 10 ? `0${i}` : `${i}`, value: `${i}` }))}
            onChange={({ item }: { item: ItemType }) => setMinute(parseInt(item.value, 10))}
          />
        </View>
        <View style={styles.pickerContainer}>
          <WheelPicker
            items={['AM', 'PM'].map((period) => ({ label: period, value: period }))}
            onChange={({ item }: { item: ItemType }) => setAmPm(item.value)}
          />
        </View>
      </View>

      <Text style={styles.subtitle}>Select Days:</Text>
      <View style={styles.daysRow}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) && styles.dayButtonSelected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text
              style={[
                styles.dayButtonText,
                selectedDays.includes(day) && styles.dayButtonTextSelected,
              ]}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.dayButton, isOnce && styles.dayButtonSelected]}
        onPress={() => setIsOnce((prev) => !prev)} // Toggle the Once state
      >
        <Text style={[styles.dayButtonText, isOnce && styles.dayButtonTextSelected]}>Once</Text>
      </TouchableOpacity>

      <Button title="Set Alarm" onPress={setAlarm} color="#007BFF" />
      <View style={{ marginTop: 20 }}>
        <Button title="Activate Servo" onPress={activateServo} color="#28A745" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007BFF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#343A40',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pickerContainer: {
    width: 100,
    height: 150,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  colonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  colon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: '#6C757D',
    borderRadius: 5,
    backgroundColor: '#FFF',
  },
  dayButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#0056B3',
  },
  dayButtonText: {
    color: '#6C757D',
    fontWeight: 'bold',
  },
  dayButtonTextSelected: {
    color: '#FFF',
  },
});
