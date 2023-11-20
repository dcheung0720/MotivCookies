import { StyleSheet, Text, View, TextInput, ActivityIndicator,  TouchableOpacity} from 'react-native';
import { AddIcon, Button, Column, NativeBaseProvider } from "native-base";
import DraggableFlatList, {
    ScaleDecorator,
  } from "react-native-draggable-flatlist";
import { useEffect, useState } from 'react';
// import at the top
import "react-native-gesture-handler";

// wrap whole app with <GestureHandlerRootView>
import { GestureHandlerRootView } from "react-native-gesture-handler";

const NUM_ITEMS = 10;

function getColor(i) {
    const multiplier = 255 / (NUM_ITEMS - 1);
    const colorVal = i * multiplier;
    return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}


const Activities = ({data, setData}) =>{
    let user_id = 1

    const [inputVisibility, setInputVisibility] = useState(false);

    const [inputActivity, setInputActivity] = useState(""); 

    useEffect(()=>{
        fetch("http://10.0.0.248:5000/api/goals/1")
        .then((res) => res.json())
        .then(data => {
            setData(Object.values(data).map((x, idx) => {
                const backgroundColor = getColor(idx);
                const newGoal = {
                    key: `item-${idx + 1}`,
                    index: `${idx + 1}.    `,
                    label: x,
                    height: 100,
                    width: 100 ,
                    backgroundColor
                }
                return newGoal
            }))
        })
    }, [])

    const handleAddGoal = () =>{
        setInputVisibility((prev) => !prev);
    }

    const handleDeleteGoal = (e, item) =>{
        
        // delete from database
        fetch("http://10.0.0.248:5000/api/goals/delete",{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
                // Add any other headers if needed
              },
            body:
                JSON.stringify(
                    {
                        "goal": item.label,
                        "user_id": user_id
                    }
                )
        })
        .then(res => res.json())
        .then(data => console.log(data))

        //reindex
        setData((prev) => {

            // filter out item
            const new_data = prev.filter(x => x.label !== item.label);

            // reindex and update keys
            const updated_data = new_data.map((newItem, index) => ({
                ...newItem,
                index: `${index + 1}.    `,
                key: `item-${index + 1}`,
            }));

            return updated_data;
        });
    };

    // handleSubmitting
    const handleSubmitGoal = () =>{
        // show please enter activity error
        if (inputActivity === ""){

        }
        else{
            let index = data.length;
            const backgroundColor = getColor(index);
            const newGoal = {
                key: `item-${index + 1}`,
                index: `${index + 1}.    `,
                label: inputActivity,
                height: 100,
                width: 100 ,
                backgroundColor: backgroundColor
            }

            //upate database
            fetch("http://10.0.0.248:5000/api/goals/add",{ 
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  // Add any other headers if needed
                },
                body: JSON.stringify(
                        {
                            "goal": inputActivity,
                            "user_id": user_id
                        }
                    ),
            })
            .then(res => res.json())
            .then(d => console.log(d))

            // clear out the input activity
            setInputActivity("");

            // close the add goal page
            handleAddGoal();
            
            // change UI
            setData((prev) => [...prev, newGoal])
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
                        { backgroundColor: isActive ? "red" : item.backgroundColor, borderRadius: 7 },
                    ]}
                >
                    <Text style={styles.text}>{item.index + item.label}</Text>
                    <View style = {styles.textContainer}>
                        <Text onPress = {(e) => handleDeleteGoal(e, item)} style={styles.deleteButton}>x</Text>
                    </View>
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
            {data.length === 0 && <Text>Tip: Did you know? You are more likely to achieve your goal if you write it out?</Text>}

            {/* input text for goal */}
            {inputVisibility 
                &&
                <>
                    <TextInput
                        onChangeText={handleInputActivity}
                        value = {inputActivity}
                        placeholder='Input Goal or Activity'
                        style = {{margin: 5}}
                    />
                    <Button onPress={handleSubmitGoal}>Add Goal</Button>
                </> 
            }

            {/* list of goals */}
            {!inputVisibility &&
                <GestureHandlerRootView style = {{flex: 1}}>
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
        margin: 8,
      },
    rowItem: {
        height: 40,
        width: 200,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row"
    },
    button:{
        marginRight: 10
    },
    title:{
        fontSize: 30
    },
    textContainer:{
        borderRadius: 10,
        overflow: "hidden",
    },
    deleteButton:{
        backgroundColor: "red",
        height: 30,
        width:30,
        textAlign: "center",
        lineHeight: 30,
        zIndex: 20
    }
});

export default Activities;
