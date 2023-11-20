import { StyleSheet, View, Text, TouchableOpacity} from "react-native";
import { useEffect, useState } from "react";
import { Button } from "native-base";
import { AntDesign } from '@expo/vector-icons';


const SuggestedGoals = ({data, setData}) =>{
    
    let user_id = 1

    const [generatedGoals, setGoals] = useState([]);

    const handleGetGoals = () =>{
        fetch(`http:10.0.0.248:5000/suggestedGoals?data=${data}`)
        .then(res => res.json())
        .then(d => setGoals(Object.values(d)))
    }

    function getColor(i) {
        const multiplier = 255 / (10 - 1);
        const colorVal = i * multiplier;
        return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
    }

    const handleAddGoal = (g) =>{
        console.log(g)
        let index = data.length;
            const backgroundColor = getColor(index);
            const newGoal = {
                key: `item-${index + 1}`,
                index: `${index + 1}.    `,
                label: g,
                height: 100,
                width: 100 ,
                backgroundColor: backgroundColor
            }

            setData

            //upate database
            fetch("http://10.0.0.248:5000/api/goals/add",{ 
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  // Add any other headers if needed
                },
                body: JSON.stringify(
                        {
                            "goal": g,
                            "user_id": user_id
                        }
                    ),
            })
            .then(res => res.json())
            .then(d => console.log(d))

            setData((prev) => [...prev, newGoal])
    }


    useEffect(() =>{
        handleGetGoals()
    }, [])

    return(
        <View style = {styles.container}>
            <View style = {styles.header}>      
                <Text style = {styles.title}>Suggested Goals</Text>

                <Button style = {{width: 60}} onPress = {handleGetGoals}> 
                    <AntDesign name="reload1" size={24} color="black" />
                </Button>
            </View>

            <View>
                {generatedGoals.map((g, idx) => 
                    <TouchableOpacity onPress = {() => handleAddGoal(g)} style = {{height: 30, width: 200}}>
                        <Text>{idx + 1}. {g}</Text>
                    </TouchableOpacity>)
                }
            </View>
        </View>
    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 10
    },
    title:{
        fontSize: 30
    },
    header:{
        flexDirection: "row"
    }
})

export default SuggestedGoals;