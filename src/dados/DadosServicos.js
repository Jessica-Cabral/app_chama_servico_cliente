
export const TIPOS_SERVICO = [
  { id: 1, nome: "Elétrica" },
  { id: 2, nome: "Encanamento" },
  { id: 3, nome: "Limpeza" },
  { id: 4, nome: "Pintura" },
];

export const SERVICOS_POR_TIPO = {
  1: [
    { id: 1, nome: "Instalação de tomadas" },
    { id: 2, nome: "Troca de disjuntores" },
    { id: 3, nome: "Reparo de fiação" },
  ],
  2: [
    { id: 4, nome: "Desentupimento" },
    { id: 5, nome: "Vazamentos" },
    { id: 6, nome: "Instalação de torneiras" },
  ],
  3: [
    { id: 7, nome: "Limpeza residencial" },
    { id: 8, nome: "Limpeza comercial" },
    { id: 9, nome: "Limpeza pós-obra" },
  ],
  4: [
    { id: 10, nome: "Pintura interna" },
    { id: 11, nome: "Pintura externa" },
    { id: 12, nome: "Pintura de móveis" },
  ],
};

export const OPCOES_URGENCIA = [
  { label: "Baixa", value: "baixa" },
  { label: "Normal", value: "normal" },
  { label: "Alta", value: "alta" },
  { label: "Urgente", value: "urgente" },
];
