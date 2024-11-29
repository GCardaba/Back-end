//El ! indica que puede o puede no estar ese valor
export const schema = `#graphql
export type vuelo {
  id: ID!
  origin: string!
  destination: string!
  dateTime: string!
}

export type Query {
  getFlights (Origen: string, Destino: string): [Vuelo!]!
  getFlight (id:ID!):Vuelo

}

export type Mutation {
  addFlight(Origen: string!, Destino: string!, Fecha_hora: string!):Vuelo!
}
`;
