import { StyleSheet, Text, View, TextInput, ActivityIndicator,  TouchableOpacity } from 'react-native';
import { AddIcon, Button, Column, NativeBaseProvider } from "native-base";
import DraggableFlatList, {
    ScaleDecorator,
  } from "react-native-draggable-flatlist";
import { useState } from 'react';
// import at the top
import "react-native-gesture-handler";

// wrap whole app with <GestureHandlerRootView>
import { GestureHandlerRootView } from "react-native-gesture-handler";

const NUM_ITEMS = 0;

function getColor(i) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}



const initialData = [...Array(NUM_ITEMS)].map((d, index) => {
    const backgroundColor = getColor(index);
    return {
        key: `item-${index}`,
        label: String(index) + "",
        height: 100,
        width: 100 ,
        backgroundColor,
    };
});


const Activities = () =>{
    const [data, setData] = useState(initialData);

    const [inputVisibility, setInputVisibility] = useState(false);

    const [inputActivity, setInputActivity] = useState(""); 

    const handleAddGoal = () =>{
        setInputVisibility((prev) => !prev);
    }

    // handleSubmitting
    const handleSubmitGoal = () =>{
        // show please enter activity error
        if (inputActivity === ""){

        }
        else{
            let index = data.length;
            const backgroundColor = getColor(index);
            const newGoal = {
                key: `item-${index}`,
                label: `${index}.    ` + inputActivity,
                height: 100,
                width: 100 ,
                backgroundColor
            }

            // clear out the input activity
            setInputActivity("");

            // close the add goal page
            handleAddGoal();

            setData((prev) => [...prev, newGoal ])
            }
    }

    const handleInputActivity = (text) =>{
        setInputActivity(text)
    }

    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                    styles.rowItem,
                        { backgroundColor: isActive ? "red" : item.backgroundColor },
                    ]}
                >
                    <Text style={styles.text}>{item.label}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return(
        <View style = {styles.container}>
            <View style = {{flexDirection: "row"}}>
                <Text style = {styles.title}>Goals</Text> 
                <View style={{ flex: 1}}>
                    <Button style ={{alignSelf: "flex-end"}} onPress= {handleAddGoal}>{inputVisibility === true? "x" : "+"}</Button>
                </View>
            </View>
            <Text>Tip: Did you know? You are more likely to achieve your goal if you write it out?</Text>
            {inputVisibility 
                &&
                <>
                    <TextInput
                        onChangeText={handleInputActivity}
                        value = {inputActivity}
                        placeholder='Input Goal or Activity'
                    />
                    <Button onPress={handleSubmitGoal}>Add Goal</Button>
                </> 
            }
            {!inputVisibility &&
                <GestureHandlerRootView>
                    <DraggableFlatList
                        data={data}
                        keyExtractor={(item) => item.key}
                        renderItem={renderItem}
                    />
                </GestureHandlerRootView>
            }
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        margin: 8
      },
    rowItem: {
        height: 30,
        width: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    button:{
        marginRight: 10
    },
    title:{
        fontSize: 30
    }
});

export default Activities;
