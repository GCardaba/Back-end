import { Vuelos, VuelosModel } from "./types.ts";

export const fromModelToVuelo = (vuelosModel: VuelosModel): Vuelos => {
  return {
    id: vuelosModel._id!.toString(),
    Origen: vuelosModel.Origen,
    Destino: vuelosModel.Destino,
    Fecha_hora: vuelosModel.Fecha_hora,
  };
};
