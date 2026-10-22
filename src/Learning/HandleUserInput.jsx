import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';

const HandleUserInput = () => {
  const [text, setText] = useState('');
  const [submittedText, setsubmittedText] = useState('');

  const handleSubmit = () => {
    setsubmittedText(text);
    setText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Good Morning, Everyone Let's begin.</Text>

      <TextInput
        placeholder="Enter a text here...."
        style={styles.input}
        value={text}
        //onChangeText={text => setText(text)} Old way
        onChangeText={setText}

        // TextInput Learn more on Docs
        // multiline
        // numberOfLines={1}
        // keyboard type
      />

      <Button title="Submit" onPress={handleSubmit}></Button>

      {submittedText ? <Text>Result: {text}</Text> : null}
    </View>
  );
};

export default HandleUserInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  input: {
    width: '100',
    padding: 5,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});
