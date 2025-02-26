import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";

const SECTORS = ["Piros", "Kék", "Zöld", "Sárga", "Lila", "Narancs"];
const COLORS = ["#FF0000", "#0000FF", "#008000", "#FFD700", "#800080", "#FFA500"];

const LuckyWheel = () => {
    const rotation = useSharedValue(0);
    const [selected, setSelected] = useState<string | null>(null);

    const spinWheel = () => {
        const randomRotation = 360 * 3 + Math.floor(Math.random() * 360);
        rotation.value = withTiming(randomRotation, { duration: 3000 });

        const sectorIndex = Math.floor((randomRotation % 360) / (360 / SECTORS.length));
        setTimeout(() => setSelected(SECTORS[sectorIndex]), 3000);
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            {/* Nyíl */}
            <View style={styles.arrowContainer}>
                <View style={styles.arrow} />
            </View>

            {/* Szerencsekerék */}
            <Animated.View style={[styles.wheelContainer, animatedStyle]}>
                <Svg height="200" width="200" viewBox="0 0 200 200">
                    <G rotation={-90} origin="100,100">
                        {SECTORS.map((_, i) => {
                            const startAngle = (i * 360) / SECTORS.length;
                            const endAngle = ((i + 1) * 360) / SECTORS.length;
                            const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                            const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                            const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                            const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                            const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

                            return (
                                <Path
                                    key={i}
                                    d={`M100,100 L${x1},${y1} A100,100 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                                    fill={COLORS[i]}
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            );
                        })}
                    </G>
                </Svg>
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
    wheelContainer: { position: "absolute", width: 200, height: 200 },
    arrowContainer: { position: "absolute", top: 80, zIndex: 1 },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 20,
        borderStyle: "solid",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderBottomColor: "black",
    },
    button: { marginTop: 250, padding: 10, backgroundColor: "blue", borderRadius: 5 },
    buttonText: { color: "white", fontWeight: "bold" },
    result: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
});

export default LuckyWheel;
