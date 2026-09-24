import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    mes: {
        marginBottom: 16,
    },
    tituloMes: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#79059C",
        marginBottom: 8,
        textTransform: "capitalize",
    },
    semana: {
        flexDirection: "row",
        marginBottom: 4,
    },
    rotuloDia: {
        width: "14.28%",
        textAlign: "center",
        fontSize: 11,
        color: "#888",
        fontWeight: "600",
    },
    grade: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    dia: {
        width: "14.28%",
        aspectRatio: 1,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    diaBotao: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F3E5F5",
    },
    diaAtivo: {
        backgroundColor: "#79059C",
    },
    diaTexto: {
        fontSize: 13,
        color: "#333",
        fontWeight: "600",
    },
    diaTextoAtivo: {
        color: "#fff",
    },
    diaInativo: {
        opacity: 0.25,
    },
    selecionada: {
        marginTop: 4,
        fontSize: 14,
        color: "#333",
        fontWeight: "600",
    },
});