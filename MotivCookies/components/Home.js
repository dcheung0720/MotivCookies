import { StyleSheet,Button, Text, View, TextInput, TouchableOpacity  } from 'react-native';
import Quote from './motivational/Quote';
import Activities from './motivational/Activities';
import { VStack, Center, NativeBaseProvider } from 'native-base';
import { useState } from 'react';

const Home = () =>{

    const [activityModal, setActivityModal] = useState(false);

    const handleActivityModal = () =>{
        setActivityModal((prev) => !prev);
    }

    

    return(
        <NativeBaseProvider>
            <View style={styles.container }>
                <VStack space={6} alignItems="center" justifyContent= "center">
                    <TouchableOpacity >
                        <Center style = {styles.center}  bg="#B7FFF1" rounded="md" shadow={3}>
                            <Quote/>
                        </Center>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={activityModal? 1: .7} style = {activityModal? styles.centerFocus: styles.center}  onPress = {activityModal? null: handleActivityModal}>
                        <Center style = {activityModal? styles.centerFocus: styles.center}  bg="#68BBE3" rounded="md" shadow={3}>
                                <Activities/>  
                        </Center>
                     </TouchableOpacity >
                     
                     <TouchableOpacity >
                            <Center style = {styles.center} bg="#F5F5DC" rounded="md" shadow={3} />
                    </TouchableOpacity>
                </VStack>
            </View>
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
        height : 150, 
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