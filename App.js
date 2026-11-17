import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'zadania';

export default function App() {
  const [text, setText] = useState('');
  const [items, setItems] = useState([]);

  // Wczytaj zapisane zadania przy starcie
  useEffect(() => {
    AsyncStorage.getItem(KEY).then((json) => {
      if (json) setItems(JSON.parse(json));
    });
  }, []);

  // Zapisuj zadania po każdej zmianie
  useEffect(() => {
    AsyncStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addItem = () => {
    if (text.trim() === '') return;
    setItems([...items, { id: Date.now().toString(), title: text.trim(), done: false }]);
    setText('');
  };

  const toggleItem = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Moje zadania</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Nowe zadanie..."
          value={text}
          onChangeText={setText}
          onSubmitEditing={addItem}
        />
        <Button title="Dodaj" onPress={addItem} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text style={styles.empty}>Brak zadań</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => toggleItem(item.id)}>
              <Text style={[styles.itemText, item.done && styles.done]}>
                {item.done ? '✓ ' : '○ '}
                {item.title}
              </Text>
            </TouchableOpacity>
            <Button title="Usuń" color="red" onPress={() => removeItem(item.id)} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f2f2f7' },
  title: { fontSize: 26, fontWeight: 'bold', marginVertical: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    fontSize: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: { fontSize: 18 },
  done: { textDecorationLine: 'line-through', color: 'gray' },
  empty: { textAlign: 'center', marginTop: 24, color: 'gray' },
});