import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from "react-native-reanimated";

const COUPONS = ["10% OFF", "20% OFF", "30% OFF", "50% OFF", "1000Ft KUPON", "INGYENES SZÁLLÍTÁS"];
const COLORS = ["#FF5733", "#33FF57", "#5733FF", "#FFD700", "#FF33A1", "#33FFF5"];
const SEGMENT_ANGLE = 360 / COUPONS.length;

const LuckyWheel = () => {
    const rotation = useSharedValue(0);
    const [selected, setSelected] = useState<string | null>(null);

    const spinWheel = () => {
        const randomSegment = Math.floor(Math.random() * COUPONS.length);
        const finalRotation = 360 * 5 + (randomSegment * SEGMENT_ANGLE) + (SEGMENT_ANGLE / 2); // Mindig ugyanolyan sebesség és irány

        // Reseteljük a forgatást
        rotation.value = 0;

        // Animáció indítása
        rotation.value = withTiming(finalRotation, { duration: 2000 }, () => {
            // Nyeremény beállítása az animáció végén
            const normalizedRotation = finalRotation % 360;
            const selectedSegment = Math.floor(normalizedRotation / SEGMENT_ANGLE);
            runOnJS(setSelected)(COUPONS[selectedSegment]);
        }); // Gyorsabb pörgés
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    return (
        <View style={styles.container}>
            {/* Nyíl a tetején */}
            <View style={styles.arrowWrapper}>
                <View style={styles.arrow} />
            </View>

            {/* Szerencsekerék */}
            <View style={styles.wheelWrapper}>
                <Animated.View style={[styles.wheelContainer, animatedStyle]}>
                    <Svg height="250" width="250" viewBox="0 0 200 200">
                        <G rotation={-90} origin="100,100">
                            {COUPONS.map((coupon, i) => {
                                const startAngle = i * SEGMENT_ANGLE;
                                const endAngle = (i + 1) * SEGMENT_ANGLE;
                                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

                                const x1 = 100 + 100 * Math.cos((Math.PI * startAngle) / 180);
                                const y1 = 100 + 100 * Math.sin((Math.PI * startAngle) / 180);
                                const x2 = 100 + 100 * Math.cos((Math.PI * endAngle) / 180);
                                const y2 = 100 + 100 * Math.sin((Math.PI * endAngle) / 180);

                                const textX = 100 + 60 * Math.cos((Math.PI * (startAngle + endAngle) / 2) / 180);
                                const textY = 100 + 60 * Math.sin((Math.PI * (startAngle + endAngle) / 2) / 180);

                                return (
                                    <G key={i}>
                                        <Path
                                            d={`M100,100 L${x1},${y1} A100,100 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                                            fill={COLORS[i]}
                                            stroke="white"
                                            strokeWidth="2"
                                        />
                                        <SvgText
                                            x={textX}
                                            y={textY}
                                            fill="white"
                                            fontSize="10"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            transform={`rotate(${(startAngle + endAngle) / 2}, ${textX}, ${textY})`}
                                        >
                                            {coupon}
                                        </SvgText>
                                    </G>
                                );
                            })}
                        </G>
                    </Svg>
                </Animated.View>
            </View>

            {/* Kipörgetett nyeremény */}
            <Text style={styles.selectedText}>{selected ? `Nyeremény: ${selected}` : "Pörgesd meg a kereket!"}</Text>

            {/* Pörgetés gomb */}
            <TouchableOpacity onPress={spinWheel} style={styles.button}>
                <Text style={styles.buttonText}>Pörgetés</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" },
    arrowWrapper: { alignItems: "center", marginBottom: 5 },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 20,
        borderRightWidth: 20,
        borderTopWidth: 40,
        borderBottomWidth: 0,
        borderStyle: "solid",
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "red",
    },
    wheelWrapper: { alignItems: "center", justifyContent: "center", marginBottom: 20 },
    wheelContainer: { width: 250, height: 250 },
    selectedText: { fontSize: 18, fontWeight: "bold", color: "black", marginBottom: 20 },
    button: { padding: 15, backgroundColor: "#007bff", borderRadius: 10 },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default LuckyWheel;