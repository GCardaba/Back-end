import { OptionalId } from "mongodb";

export type Vuelos = {
  id: string;
  Origen: string;
  Destino: string;
  Fecha_hora: string;
};

export type VuelosModel = OptionalId<{
  Origen: string;
  Destino: string;
  Fecha_hora: string;
}>;
