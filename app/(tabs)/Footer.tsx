import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";

const Footer = ({ darkMode }: { darkMode: boolean }) => {
    return (
        <LinearGradient
            colors={darkMode ? ['#0f0c29', '#302b63', '#24243e'] : ['#a18cd1', '#fbc2eb']}
            style={styles.footer}
        >
            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Szerencsekerék</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Weboldal</Text>
            </TouchableOpacity>
        </LinearGradient>
    );
};

export default Footer;