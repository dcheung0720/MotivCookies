import { StyleSheet, View, Text, TouchableOpacity} from "react-native";
import { useEffect, useState } from "react";
import { Button } from "native-base";


const SuggestedGoals = ({data, setData}) =>{
    
    const [generatedGoals, setGoals] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const handleGetGoals = () =>{
        fetch(`http:10.0.0.248:5000/suggestedGoals?data=${data}`)
        .then(res => res.json())
        .then(d => setGoals(Object.values(d)))
    }


    useEffect(() =>{
        handleGetGoals()
    }, [])

    return(
        <View style = {styles.container}>
            <View style = {styles.header}>      
                <Text style = {styles.title}>Suggested Goals</Text>

                <Button style = {{width: 60}} onPress = {handleGetGoals}> 
                    {/* <Text><FontAwesomeIcon icon={faRotateRight} /></Text> */}
                </Button>
            </View>

            <View>
                {generatedGoals.map((g, idx) => 
                    <TouchableOpacity>
                        <Text>{g}</Text>
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