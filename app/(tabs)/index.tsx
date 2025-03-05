import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';

const COUPONS = ["10% OFF", "20% OFF", "30% OFF", "50% OFF", "1000Ft KUPON", "INGYENES SZÁLLÍTÁS"];
const COLORS = ["#FF5733", "#33FF57", "#5733FF", "#FFD700", "#FF33A1", "#33FFF5"];
const SEGMENT_ANGLE = 360 / COUPONS.length;

const LuckyWheel = () => {
    const rotation = useSharedValue(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);

    const spinWheel = () => {
        const randomSegment = Math.floor(Math.random() * COUPONS.length);
        const extraTurns = Math.floor(Math.random() * 3) + 3; // Véletlenszerűen 3-5 teljes fordulat
        const finalRotation = 360 * extraTurns + (randomSegment * SEGMENT_ANGLE + SEGMENT_ANGLE / 2); // Véletlenszerű szegmens alapján számolt forgás

        // Reseteljük a forgatást
        rotation.value = 0;

        // Véletlenszerű időtartam (2000-4000 ms)
        const duration = Math.floor(Math.random() * 2000) + 2000;

        // Animáció indítása
        rotation.value = withTiming(finalRotation, { duration }, () => {
            // Számoljuk ki az effektív szöget a nyíl szempontjából
            let effective = 90 - finalRotation;
            effective = ((effective % 360) + 360) % 360; // normalizáljuk 0-359° közé

            // A megfelelő szegmens indexje
            const selectedSegment = Math.floor(effective / SEGMENT_ANGLE) % COUPONS.length;
            if (selectedSegment > 1) {
                runOnJS(setSelected)(COUPONS[selectedSegment-2]);
            } else if (selectedSegment === 1) {
                runOnJS(setSelected)(COUPONS[COUPONS.length-1]);
            }
            else {
                runOnJS(setSelected)(COUPONS[COUPONS.length-2]);
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <LinearGradient
            colors={darkMode ? ['#333', '#111'] : ['#f0f0f0', '#d0d0d0']}
            style={styles.container}
        >
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
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
            <Text style={[styles.selectedText, darkMode ? styles.darkText : styles.lightText]}>
                {selected ? `Nyeremény: ${selected}` : "Pörgesd meg a kereket!"}
            </Text>

            {/* Pörgetés gomb */}
            <TouchableOpacity onPress={spinWheel} style={styles.button}>
                <Text style={styles.buttonText}>Pörgetés</Text>
            </TouchableOpacity>

            {/* Sötét mód váltó gomb */}
            <TouchableOpacity onPress={toggleDarkMode} style={[styles.button, styles.darkModeButton]}>
                <Text style={styles.buttonText}>{darkMode ? "Világos mód" : "Sötét mód"}</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: "center", justifyContent: "center" },
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
    selectedText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
    lightText: { color: "black" },
    darkText: { color: "white" },
    button: { padding: 15, backgroundColor: "#007bff", borderRadius: 10, marginVertical: 10 },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    darkModeButton: { backgroundColor: "#555" },
});

export default LuckyWheel;