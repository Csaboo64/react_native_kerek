import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const SECTORS = ["Nyeremény 1", "Nyeremény 2", "Nyeremény 3", "Nyeremény 4"];

const LuckyWheel = () => {
    const rotation = useSharedValue(0);
    const [selected, setSelected] = useState<string | null>(null);

    const spinWheel = () => {
        const randomRotation = 360 * 3 + Math.floor(Math.random() * 360);
        rotation.value = withTiming(randomRotation, { duration: 3000 });
        
        const sectorIndex = Math.floor((randomRotation % 360) / (360 / SECTORS.length));
        setTimeout(() => setSelected(SECTORS[sectorIndex]), 3000);
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.wheel, { transform: [{ rotate: `${rotation.value}deg` }] }]}>
                {SECTORS.map((sector, index) => (
                    <View key={index} style={styles.sector}>
                        <Text>{sector}</Text>
                    </View>
                ))}
            </Animated.View>
            <TouchableOpacity onPress={spinWheel} style={styles.button}>
                <Text style={styles.buttonText}>Pörgetés</Text>
            </TouchableOpacity>
            {selected && <Text style={styles.result}>Nyertél: {selected}!</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
    wheel: { width: 200, height: 200, borderRadius: 100, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" },
    sector: { position: "absolute", top: 10 },
    button: { marginTop: 20, padding: 10, backgroundColor: "blue", borderRadius: 5 },
    buttonText: { color: "white", fontWeight: "bold" },
    result: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
});

export default LuckyWheel;
