import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from "react-native-reanimated";

const COUPONS = ["10% OFF", "20% OFF", "30% OFF", "50% OFF", "1000Ft KUPON", "INGYENES SZÁLLÍTÁS"];
const COLORS = ["#FF5733", "#33FF57", "#5733FF", "#FFD700", "#FF33A1", "#33FFF5"];

const LuckyWheel = () => {
    const rotation = useSharedValue(0);
    const [selected, setSelected] = useState<string | null>(null);

    const spinWheel = () => {
        const randomRotation = 360 * 3 + Math.floor(Math.random() * 360);
        rotation.value = withTiming(randomRotation, { duration: 3000 });

        const sectorIndex = Math.floor((randomRotation % 360) / (360 / COUPONS.length));
        setTimeout(() => setSelected(COUPONS[sectorIndex]), 3000);
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
                        {COUPONS.map((coupon, i) => {
                            const startAngle = (i * 360) / COUPONS.length;
                            const endAngle = ((i + 1) * 360) / COUPONS.length;
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

            <TouchableOpacity onPress={spinWheel} style={styles.button}>
                <Text style={styles.buttonText}>Pörgetés</Text>
            </TouchableOpacity>

            {selected && <Text style={styles.result}>Nyereményed: {selected}!</Text>}
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
