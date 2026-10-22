// TOPICS
//==========================//
// Styling { Styling in React Native , FlexBox Layout} CSS
//{1.Inline CSS, 2.JS- Object As internal CSS, 3.StyleSheet CSS}
// Core Components { View, Text, Button, Pressable, Touchable, }
//========================//

import { Text, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CoreComponent = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Hello Everyone</Text>
      <Image
        style={{ width: 200, height: 300 }}
        source={{
          uri: 'https://images.unsplash.com/photo-1773332611514-238856b76198?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyN3x8fGVufDB8fHx8fA%3D%3D',
        }}
      />

      <Pressable style={styles.button}>
        <Text style={styles.btnText}> Press Me </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CoreComponent;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#eea4a4',
    padding: 20,
    gap: 10,
  },
  text: {
    color: 'black',
    fontSize: 35,
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    // paddingVertical: 5,
    //paddingHorizontal: 10,
    backgroundColor: '#f12626',
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    marginTop: 10,
    borderWidth: 3,
  },

  btnText: {
    color: 'black',
    flexWeight: '500',
    fontSize: 35,
    fontWeight: 'bold',
  },
});
