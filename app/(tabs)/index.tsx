import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StatusBar, Alert, Clipboard } from "react-native";
import { WebView } from "react-native-webview";
import Svg, { Path, G, Text as SvgText, TSpan, Circle } from "react-native-svg";
import Animated, { useSharedValue, withTiming, useAnimatedStyle, runOnJS } from "react-native-reanimated";
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from '../../styles/styles';
import Footer from './Footer'; // Importáljuk a Footer komponenst


const COUPONS = ["10% OFF", "20% OFF", "NEM NYERT", "50% OFF", "1000Ft KUPON", "INGYENES SZÁLLÍTÁS"];
const COLORS = ["#FF5733", "#33FF57", "#5733FF", "#FFD700", "#FF33A1", "#33FFF5"];
const SEGMENT_ANGLE = 360 / COUPONS.length;

const WEIGHTS = {
    "10% OFF": 25,
    "20% OFF": 10,
    "NEM NYERT": 10,
    "50% OFF": 5,
    "1000Ft KUPON": 25,
    "INGYENES SZÁLLÍTÁS": 25
};

const getRandomCoupon = () => {
    const weightedCoupons = [];
    for (const [coupon, weight] of Object.entries(WEIGHTS)) {
        for (let i = 0; i < weight * 10; i++) {
            weightedCoupons.push(coupon);
        }
    }
    const randomIndex = Math.floor(Math.random() * weightedCoupons.length);
    return weightedCoupons[randomIndex];
};

const LuckyWheel = () => {
    const rotation = useSharedValue(0);
    const [selected, setSelected] = useState<string | null>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [couponCode, setCouponCode] = useState<string | null>(null);
    const [showWebView, setShowWebView] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('http://192.168.0.73:5173/'); // Alapértelmezett URL

    const openWebsite = () => {
        setShowWebView(true);
    };

    const openWheel = () => {
        setShowWebView(false);
    };

    const fetchCouponCode = async (type: string) => {
        try {
            const encodedType = encodeURIComponent(type);
            const response = await fetch(`http://192.168.0.73:5000/coupon/addCoupon/${encodedType}`, {
                method: "POST", // POST metódus
                headers: {
                    "Content-Type": "application/json", // JSON formátumú adatok küldése
                },
         
            });

            
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.text();
            console.log("Coupon code fetched:", data);
            setCouponCode(data);
        } catch (error) {
            console.error("Error fetching coupon code:", error);

            // Részletesebb naplózás
            if (error instanceof Error) {
                console.error("Error message:", error.message);
                console.error("Error stack:", error.stack);
            } else {
                console.error("Unknown error occurred during fetch.");
            }
        }
    };




    const spinWheel = async () => {
        const randomCoupon = getRandomCoupon();
        const randomSegment = COUPONS.indexOf(randomCoupon);
        const extraTurns = Math.floor(Math.random() * 3) + 3; // Véletlenszerűen 3-5 teljes fordulat
        const finalRotation = 360 * extraTurns + (randomSegment * SEGMENT_ANGLE + SEGMENT_ANGLE / 2); // Véletlenszerű szegmens alapján számolt forgás

        // Reseteljük a forgatást
        rotation.value = 0;

        // Véletlenszerű időtartam (2000-4000 ms)
        const duration = Math.floor(Math.random() * 2000) + 2000;

        // Animáció indítása
        rotation.value = withTiming(finalRotation, { duration }, async () => {
            try {
                let effective = 90 - finalRotation;
                effective = ((effective % 360) + 360) % 360;

                const selectedSegment = Math.floor(effective / SEGMENT_ANGLE) % COUPONS.length;

                console.log("Effective angle:", effective);
                console.log("Selected segment index:", selectedSegment);

                if (selectedSegment > 1) {
                    runOnJS(setSelected)(COUPONS[selectedSegment - 2]);
                    await runOnJS(fetchCouponCode)((selectedSegment - 2).toString());
                } else if (selectedSegment === 1) {
                    runOnJS(setSelected)(COUPONS[COUPONS.length - 1]);
                    await runOnJS(fetchCouponCode)((COUPONS.length - 1).toString());
                } else {
                    runOnJS(setSelected)(COUPONS[COUPONS.length - 2]);
                    await runOnJS(fetchCouponCode)((COUPONS.length - 2).toString());
                }
            } catch (error) {
                console.error("Error in runOnJS or fetchCouponCode:", error);

                // Részletesebb naplózás
                if (error instanceof Error) {
                    console.error("Error message:", error.message);
                    console.error("Error stack:", error.stack);
                } else {
                    console.error("Unknown error occurred during animation.");
                }
            }
        });
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const copyToClipboard = () => {
        if (couponCode) {
            Clipboard.setString(couponCode);
            Alert.alert("Sikeres másolás", "A kuponkódot a vágólapra másoltuk!");
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const backgroundColor = darkMode ? "#121212" : "#FFFFFF";
    const textColor = darkMode ? "#FFFFFF" : "#333333";

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

            {/* WebView mindig renderelve van, de el van rejtve, ha a szerencsekerék látható */}
            <View style={{ flex: 1, display: showWebView ? "flex" : "none" }}>
                <WebView
                    source={{ uri: currentUrl }} // Az aktuális URL-t használjuk
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    style={{ flex: 1, marginTop: 55 }}
                    onNavigationStateChange={(navState) => {
                        setCurrentUrl(navState.url); // Az aktuális URL mentése
                    }}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error("WebView error: ", nativeEvent);
                        Alert.alert("Hiba történt a weboldal betöltésekor.", nativeEvent.description);
                    }}
                    onHttpError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error("HTTP error: ", nativeEvent);
                        Alert.alert("HTTP hiba történt.", `Kód: ${nativeEvent.statusCode}`);
                    }}
                />
            </View>

            {/* Szerencsekerék */}
            {!showWebView && (
                <LinearGradient
                    colors={darkMode ? ['#0f0c29', '#302b63', '#24243e'] : ['#a18cd1', '#fbc2eb']}
                    style={styles.container}
                >
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        {/* App címe */}
                        <Text style={[styles.title, { color: textColor }]}>
                            HyperchargeMarket Szerencsekerék
                        </Text>

                        {/* Nyíl a szerencsekerék fölött */}
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
                        <Text style={[styles.selectedText, { color: textColor }]}>
                            {selected === "NEM NYERT" ? "Sajnálom, nem nyertél :(" : selected ? `Gratulálok az ön nyereménye: ${selected}` : "Pörgesd meg a kereket!"}
                        </Text>

                        {/* Kupon kód és másolás gomb */}
                        {couponCode && (
                            <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                                <Text style={[styles.couponText, darkMode ? styles.darkText : styles.lightText]}>
                                    {couponCode}
                                </Text>
                                <TouchableOpacity onPress={copyToClipboard} style={[styles.copyButton, { backgroundColor: darkMode ? "#333333" : "#DDDDDD" }]}>
                                    <Text style={[styles.copyButtonText, { color: textColor }]}>Másolás</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Pörgetés gomb */}
                        <TouchableOpacity onPress={spinWheel} style={[styles.button, { backgroundColor: darkMode ? "#333333" : "#DDDDDD" }]}>
                            <Text style={[styles.buttonText, { color: textColor }]}>Pörgetés</Text>
                        </TouchableOpacity>

                        {/* Sötét mód váltó gomb */}
                        <TouchableOpacity onPress={toggleDarkMode} style={[styles.button, { backgroundColor: darkMode ? "#333333" : "#DDDDDD" }]}>
                            <Text style={[styles.buttonText, { color: textColor }]}>{darkMode ? "Világos mód" : "Sötét mód"}</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            )}

            <Footer darkMode={darkMode} onOpenWebsite={openWebsite} onOpenWheel={openWheel} />
        </View>
    );
};

export default LuckyWheel;