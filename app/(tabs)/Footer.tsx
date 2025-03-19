import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "./styles";

const Footer = () => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Szerencsekerék</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Weboldal</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Footer;