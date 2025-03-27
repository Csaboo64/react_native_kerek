import React from "react";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../../styles/styles";
import Ionicons from "react-native-vector-icons/Ionicons";

const Footer = ({ darkMode, onOpenWebsite, onOpenWheel }: { darkMode: boolean; onOpenWebsite: () => void; onOpenWheel: () => void }) => {
    return (
        <LinearGradient
            colors={darkMode ? ['#0f0c29', '#302b63', '#24243e'] : ['#a18cd1', '#fbc2eb']}
            style={styles.footer}
        >
            {/* Szerencsekerék ikon */}
            <TouchableOpacity style={styles.footerIconButton} onPress={onOpenWheel}>
                <Ionicons name="game-controller" size={30} color="white" />
            </TouchableOpacity>

            {/* Weboldal ikon */}
            <TouchableOpacity style={styles.footerIconButton} onPress={onOpenWebsite}>
                <Ionicons name="globe-outline" size={30} color="white" />
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default Footer;