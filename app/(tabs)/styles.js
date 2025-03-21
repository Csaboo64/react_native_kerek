import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    couponText: { fontSize: 16, fontWeight: "bold", marginBottom: 20 },
    lightText: { color: "black" },
    darkText: { color: "white" },
    button: { padding: 15, backgroundColor: "#007bff", borderRadius: 10, marginVertical: 10 },
    buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
    darkModeButton: { backgroundColor: "#555" },
    footer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 20,
        height: 100,
        backgroundColor: "transparent", // A háttérszín a LinearGradient-ből jön
    },
    footerButton: {
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    footerButtonText: {
        color: "white",
        fontWeight: "bold",
    },
    footerIconButton: {
        width: 60,
        height: 60,
        borderRadius: 30, // Kör alakú gomb
        backgroundColor: "#007bff",
        justifyContent: "center",
        alignItems: "center",
    },
});