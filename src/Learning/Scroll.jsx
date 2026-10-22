//=====================//
//Scroll View         //
//===================//

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Scroll = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        horizontal
        style={styles.container}
      >
        <View style={styles.box1} />
        <View style={styles.box2} />
        <View style={styles.box3} />
        <View style={styles.box1} />
        <View style={styles.box2} />
        <View style={styles.box3} />
        <View style={styles.box1} />
        <View style={styles.box2} />
        <View style={styles.box3} />
        <View style={styles.box1} />
        <View style={styles.box2} />
        <View style={styles.box3} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Scroll;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },

  container: {
    backgroundColor: 'black',
  },

  scrollContent: {
    gap: 10,
    padding: 10,
  },

  box1: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'red',
  },

  box2: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'yellow',
  },

  box3: {
    width: 80,
    height: 80,
    borderRadius: 50,
    backgroundColor: 'green',
  },
});
