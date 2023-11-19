import { useEffect, useRef, useState} from 'react';
import { StyleSheet, Text, View, TextInput, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Button, NativeBaseProvider } from "native-base";

const Quote = () =>{
    const [feeling, setFeeling] = useState("");
    const [motivationalQuote, setMotivationalQuote] = useState("");
    const [editFeeling, setEditFeeling] = useState(true);
    const [loading, setLoading] = useState(false);
  
    const submitFeeling = () =>{
      // no longer editing
      setEditFeeling(false);

      // loading!
      setLoading(true);

      //send data to backend
      fetch("http://10.0.0.248:5000/motivationalQuote".concat(`?data=${feeling}`))
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setMotivationalQuote(data["Quote"])
    });
    }
  
    const handleFeelingChange = (text) =>{
        setFeeling(text);
    }

    return(
        <NativeBaseProvider>
            {
            loading? 
                <View style={styles.container}>
                    <Text style= {{fontSize: 20}}>Quote of the day:</Text>
                    <ActivityIndicator size="small" color="#0000ff" />
                </View>
                :
                motivationalQuote === "" || editFeeling === true ?
                    <View style={styles.container}>
                        <Text>How are you feeling today?</Text>
                        <TextInput
                            onChangeText = {handleFeelingChange}
                            value= {feeling}
                            placeholder="Type here"
                        >
                        </TextInput>
                        <Button
                            onPress={submitFeeling}
                            color="#841584"
                            accessibilityLabel="Submit your feelings"
                        >
                            Get MotivCookie
                        </Button>
                        <StatusBar style="auto" />  
                    </View> 
                :
                <View style={styles.container}>
                    <Text style= {{fontSize: 20}}>Quote of the day:</Text>
                    <Text style= {{fontSize: 15, margin: 2}}>{motivationalQuote}</Text>
                    <Button onPress={() => {
                        setEditFeeling((prev) => !prev)}}> 
                        New Feeling 
                    </Button>
                </View>}        
        </NativeBaseProvider>
    )
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });

export default Quote;
