// Aula 17/09/2026
// Ponto de entrada React: só o NavigationContainer e a Raiz.
// Sem useState, sem login, sem consulta. A decisão de tela está em src/navigation/Raiz.tsx.

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Raiz from "./src/navigation/Raiz";

export default function App() {
  return (
    <NavigationContainer>
      <Raiz />
    </NavigationContainer>
  );
}