import { Medico } from "./medico";
import { Paciente } from "../types/paciente";
import { StatusConsulta } from "../types/statusConsulta";

export interface Consulta {
    id: number;
    medico: Medico;
    paciente: Paciente;
    data: Date;
    valor: number;
    status: StatusConsulta;
    observacoes?: string;
}

