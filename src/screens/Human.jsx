import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

const HumanTypingScreen = () => {
  const [text, setText] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Type your message:</Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        placeholder="Start typing here..."
        value={text}
        onChangeText={setText}
        autoFocus
        placeholderTextColor={'black'}
      />
      <Text style={styles.characterCount}>
        {text.length} characters
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top', // For Android to align text to top
    minHeight: 150, // Minimum height for multiline
    marginBottom: 10,
  },
  characterCount: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
});

export default HumanTypingScreen;