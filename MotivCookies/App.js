import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState} from 'react';
import { StyleSheet,Button, Text, View, TextInput } from 'react-native';

export default function App() {

  const [feeling, setFeeling] = useState("");

  const submitFeeling = () =>{
    //send data to backend
    fetch("http://10.0.0.248:5000".concat(`?data=${feeling}`))
    .then((res) => res.json())
    .then((data) => console.log(data));
  }

  const handleFeelingChange = (text) =>{
      setFeeling(text);
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <TextInput
        onChangeText = {handleFeelingChange}
        value= {feeling}
        placeholder="useless placeholder"
      >

      </TextInput>
      <Button
          onPress={submitFeeling}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
