import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    conteudo: {
        padding: 20,
        paddingBottom: 40,
    },
    secao: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#fff",
    },
    secaoErro: {
        borderColor: "#F44336",
    },
    titulo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    texto: {
        fontSize: 14,
        color: "#666",
        marginBottom: 12,
    },
    textoErro: {
        fontSize: 13,
        color: "#F44336",
        marginTop: 8,
    },
    textoSucesso: {
        fontSize: 15,
        color: "#2E7D32",
        fontWeight: "600",
        textAlign: "center",
    },
    secaoSucesso: {
        backgroundColor: "#E8F5E9",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
});