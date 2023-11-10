import { StyleSheet,Button, Text, View, TextInput } from 'react-native';
import Quote from './motivational/Quote';
import Activities from './motivational/Activities';
import { VStack, Center, NativeBaseProvider } from 'native-base';

const Home = () =>{
    return(
        <NativeBaseProvider>
            <View style={styles.container}>
                <VStack space={6} alignItems="center" justifyContent= "center">
                    <Center w="80" h="150" bg="indigo.300" rounded="md" shadow={3}>
                        <Quote/>
                    </Center>
                    <Center style = {styles.center} w="80" h="150" bg="indigo.500" rounded="md" shadow={3}>
                            <Activities/>  
                     </Center>
                    <Center w="80" h="150" bg="indigo.700" rounded="md" shadow={3} />
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
    },
    center:{
        overflow: "scroll"
    }
  });


export default Home;