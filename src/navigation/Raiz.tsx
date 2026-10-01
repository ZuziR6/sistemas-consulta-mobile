// Aula 01/10/2026
// Três destinos depois do login: Auth, App (paciente/médico) e Admin.

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Usuario } from "../types/usuario";
import { ehAdmin } from "../utils/ehAdmin";
import {
    limparSessao,
    obterSessao,
    salvarSessao,
    semearDadosIniciais,
} from "../services/storage";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import Agendar from "../screens/Agendar";
import PainelAdmin from "../screens/PainelAdmin";
import AdminConsultas from "../screens/AdminConsultas";
import AdminPacientes from "../screens/AdminPacientes";
import AdminMedicos from "../screens/AdminMedicos";
import AdminSenha from "../screens/AdminSenha";
import { styles as estilosCarregar } from "../styles/carregando.styles";

const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();
const AdminStack = createNativeStackNavigator();

const opcoesCabecalho = {
    headerStyle: { backgroundColor: "#79059C" },
    headerTintColor: "#fff",
    headerTitleStyle: { fontWeight: "bold" as const },
};

function StackAuth({
    onEntrou,
}: {
    onEntrou: (usuario: Usuario) => void;
}) {
    return (
        <AuthStack.Navigator screenOptions={opcoesCabecalho}>
            <AuthStack.Screen name="Login" options={{ title: "Login" }}>
                {({ navigation }) => (
                    <Login
                        onEntrou={onEntrou}
                        onIrCadastro={() => navigation.navigate("Cadastro")}
                    />
                )}
            </AuthStack.Screen>
            <AuthStack.Screen name="Cadastro" options={{ title: "Cadastro" }}>
                {({ navigation }) => (
                    <Cadastro
                        onEntrou={onEntrou}
                        onIrLogin={() => navigation.navigate("Login")}
                    />
                )}
            </AuthStack.Screen>
        </AuthStack.Navigator>
    );
}

function StackApp({
    usuario,
    onSair,
}: {
    usuario: Usuario;
    onSair: () => void;
}) {
    return (
        <AppStack.Navigator screenOptions={opcoesCabecalho}>
            <AppStack.Screen name="Home" options={{ title: "Minhas Consultas" }}>
                {({ navigation }) => (
                    <Home usuario={usuario} onSair={onSair} navigation={navigation} />
                )}
            </AppStack.Screen>
            <AppStack.Screen name="Agendar" options={{ title: "Agendar consulta" }}>
                {({ navigation }) => (
                    <Agendar usuario={usuario} navigation={navigation} />
                )}
            </AppStack.Screen>
        </AppStack.Navigator>
    );
}

function StackAdmin({
    usuario,
    onSair,
    onAtualizou,
}: {
    usuario: Usuario;
    onSair: () => void;
    onAtualizou: (usuario: Usuario) => void;
}) {
    return (
        <AdminStack.Navigator screenOptions={opcoesCabecalho}>
            <AdminStack.Screen name="Painel" options={{ title: "Administração" }}>
                {({ navigation }) => (
                    <PainelAdmin
                        usuario={usuario}
                        onSair={onSair}
                        navigation={navigation}
                    />
                )}
            </AdminStack.Screen>
            <AdminStack.Screen
                name="AdminConsultas"
                component={AdminConsultas}
                options={{ title: "Consultas" }}
            />
            <AdminStack.Screen
                name="AdminPacientes"
                component={AdminPacientes}
                options={{ title: "Pacientes" }}
            />
            <AdminStack.Screen
                name="AdminMedicos"
                component={AdminMedicos}
                options={{ title: "Médicos" }}
            />
            <AdminStack.Screen name="AdminSenha" options={{ title: "Senha" }}>
                {() => <AdminSenha usuario={usuario} onAtualizou={onAtualizou} />}
            </AdminStack.Screen>
        </AdminStack.Navigator>
    );
}

function TelaCarregando() {
    return (
        <View style={estilosCarregar.container}>
            <ActivityIndicator color="#fff" />
            <Text style={estilosCarregar.texto}>Carregando...</Text>
        </View>
    );
}

export default function Raiz() {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [pronto, setPronto] = useState(false);

    useEffect(() => {
        async function iniciar() {
            await semearDadosIniciais();
            const sessao = await obterSessao();
            setUsuario(sessao);
            setPronto(true);
        }
        iniciar();
    }, []);

    async function entrar(usuarioLogado: Usuario) {
        await salvarSessao(usuarioLogado);
        setUsuario(usuarioLogado);
    }

    async function atualizarSessao(usuarioAtualizado: Usuario) {
        await salvarSessao(usuarioAtualizado);
        setUsuario(usuarioAtualizado);
    }

    async function sair() {
        await limparSessao();
        setUsuario(null);
    }

    if (!pronto) {
        return <TelaCarregando />;
    }

    if (!usuario) {
        return <StackAuth onEntrou={entrar} />;
    }

    if (ehAdmin(usuario)) {
        return (
            <StackAdmin
                usuario={usuario}
                onSair={sair}
                onAtualizou={atualizarSessao}
            />
        );
    }

    return <StackApp usuario={usuario} onSair={sair} />;
}