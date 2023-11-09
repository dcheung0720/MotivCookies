import { StyleSheet, Text, View, TextInput, ActivityIndicator,  TouchableOpacity } from 'react-native';
import { Button, NativeBaseProvider } from "native-base";
import DraggableFlatList, {
    ScaleDecorator,
  } from "react-native-draggable-flatlist";
import { useState } from 'react';

  const NUM_ITEMS = 5;
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


    const renderItem = ({ item, drag, isActive }) => {
        return (
            <ScaleDecorator>
                <TouchableOpacity
                    onLongPress={drag}
                    disabled={isActive}
                    style={[
                    styles.rowItem,
                        { backgroundColor: isActive ? "red" : item.backgroundColor,
                        width: item.width },
                    ]}
                >
                    <Text style={styles.text}>{item.label}</Text>
                </TouchableOpacity>
            </ScaleDecorator>
        );
    };

    return(
        <View style = {styles.container}>
             <Text>Goals</Text>
             <Text>Tips: Did you know? You are more Likely to do your activity if you write it out?</Text>
             <DraggableFlatList
                data={data}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
      },
});

export default Activities;
