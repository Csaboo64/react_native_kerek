import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import Svg, { Path, G, Text as SvgText, TSpan, Circle } from "react-native-svg";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';

const COUPONS = ["10% OFF", "20% OFF", "NEM NYERT", "50% OFF", "1000Ft KUPON", "INGYENES SZÁLLÍTÁS"];
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
            colors={darkMode ? ['#0f0c29', '#302b63', '#24243e'] : ['#a18cd1', '#fbc2eb']}
            style={styles.container}
        >
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
            
            {/* App címe */}
            <Text style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
                HyperchargeMarket Szerencsekerék
            </Text>

            {/* Nyíl a tetején */}
            <View style={styles.arrowWrapper}>
                <View style={styles.arrow} />
            </View>

            {/* Szerencsekerék */}
            <View style={styles.wheelWrapper}>
                <Animated.View style={[styles.wheelContainer, animatedStyle]}>
                    <Svg height="300" width="300" viewBox="0 0 200 200">
                        <Circle cx="100" cy="100" r="100" fill="#fff" />
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
                                            fontSize={coupon === "INGYENES SZÁLLÍTÁS" ? "8" : "10"}
                                            fontWeight="bold"
                                            textAnchor="middle"
                                            transform={`rotate(${(startAngle + endAngle) / 2}, ${textX}, ${textY})`}
                                        >
                                            {coupon === "INGYENES SZÁLLÍTÁS" ? (
                                                <>
                                                    <TSpan x={textX} dy="-0.4em">INGYENES</TSpan>
                                                    <TSpan x={textX} dy="1.2em">SZÁLLÍTÁS</TSpan>
                                                </>
                                            ) : (
                                                coupon
                                            )}
                                        </SvgText>
                                    </G>
                                );
                            })}
                        </G>
                        <Circle cx="100" cy="100" r="10" fill="#000" />
                    </Svg>
                </Animated.View>
            </View>

            {/* Kipörgetett nyeremény */}
            <Text style={[styles.selectedText, darkMode ? styles.darkText : styles.lightText]}>
                {selected === "NEM NYERT" ? "Sajnálom, nem nyertél :(" : selected ? `Gratulálok az ön nyereménye: ${selected}` : "Pörgesd meg a kereket!"}
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
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
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
    wheelContainer: { width: 300, height: 300 },
    selectedText: { fontSize: 18, fontWeight: "bold", marginBottom: 20 },
    lightText: { color: "black" },
    darkText: { color: "white" },
    button: { padding: 15, backgroundColor: "#007bff", borderRadius: 10, marginVertical: 10 },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    darkModeButton: { backgroundColor: "#555" },
});

export default LuckyWheel;