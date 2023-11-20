import { StyleSheet,Button, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import Quote from './motivational/Quote';
import Activities from './motivational/Activities';
import { VStack, Center, NativeBaseProvider } from 'native-base';
import { useState } from 'react';
import SuggestedGoals from './motivational/SuggestedGoals';

const Home = () =>{

    const [activityModal, setActivityModal] = useState(false);

    const [data, setData] = useState([]);

    const handleActivityModal = () =>{
        setActivityModal((prev) => !prev);
    }


    return(
        <NativeBaseProvider>
            <TouchableOpacity activeOpacity={.9} style={styles.container} onPress = {activityModal == true ? handleActivityModal: null}>
                    <VStack space={6} alignItems="center" justifyContent= "center">
                        <TouchableOpacity activeOpacity={1} >
                            <Center style = {styles.center}  bg="#B7FFF1" rounded="md" shadow={3}>
                                <Quote/>
                            </Center>
                        </TouchableOpacity>

                        <TouchableOpacity activeOpacity={activityModal? 1: .7} style = {activityModal? styles.centerFocus: styles.center}  onPress = {activityModal? null: handleActivityModal}>
                            <Center style = {activityModal? styles.centerFocus: styles.center}  bg="#68BBE3" rounded="md" shadow={3}>
                                    <Activities data = {data} setData = {setData}/>  
                            </Center>
                        </TouchableOpacity >
                        
                        <TouchableOpacity activeOpacity={1}>
                                <Center style = {styles.center} bg="#F5F5DC" rounded="md" shadow={3}>
                                    <SuggestedGoals></SuggestedGoals>
                                </Center>
                        </TouchableOpacity>
                    </VStack>
            </TouchableOpacity>
      </NativeBaseProvider>

      )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: "#ffb7c5"
    },
    center:{
        overflow: "scroll",
        width : 300,
        height : 180, 
        zIndex: 10
    },
    centerFocus:{
        overflow: "scroll",
        position: 'absolute',
        width: "100%",
        height: "100%",
        zIndex: 15
    }
  });


export default Home;