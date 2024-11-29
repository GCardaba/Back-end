import { Collection, ObjectId } from "mongodb";
import { Vuelos, VuelosModel } from "./types.ts";
import { fromModelToVuelo } from "./utils.ts";

export const resolvers = {
  Query: {
    getFlights: async (
      _: unknown,
      { Destino, Origen }: { Destino: string; Origen: string },
      //contexto/databese de la query
      context: { VuelosCollection: Collection<VuelosModel> }
    ): Promise<Vuelos[]> => {
      //Buscas en la coleccion de la base de datos (todos los elementos) y lo conviertes a un array
      const vuelos = await context.VuelosCollection.find().toArray();

      if (Destino && Origen) {
        return vuelos
          .filter((u) => u.Destino === Destino && u.Origen === Origen)
          .map((u) => fromModelToVuelo(u));
      } else if (Destino) {
        return vuelos
          .filter((u) => u.Destino === Destino)
          .map((u) => fromModelToVuelo(u));
      } else if (Origen) {
        return vuelos
          .filter((u) => u.Origen === Origen)
          .map((u) => fromModelToVuelo(u));
      } else {
        return vuelos.map((u) => fromModelToVuelo(u));
      }
    },
    getFlight: async (
      _: unknown,
      { id }: { id: string },
      context: { VuelosCollection: Collection<VuelosModel> }
    ): Promise<Vuelos | null> => {
      const vuelosModel = await context.VuelosCollection.findOne({
        _id: new ObjectId(id),
      });
      if (!vuelosModel) {
        return null;
      }
      return fromModelToVuelo(vuelosModel);
    },
  },
  Mutation: {
    addFlight: async (
      _: unknown,
      {
        Origen,
        Destino,
        Fecha_hora,
      }: { Origen: string; Destino: string; Fecha_hora: string },
      context: { VuelosCollection: Collection<VuelosModel> }
    ): Promise<Vuelos> => {
      const { insertedId } = await context.VuelosCollection.insertOne({
        Origen,
        Destino,
        Fecha_hora,
      });
      const vuelosModel = {
        _id: insertedId,
        Origen,
        Destino,
        Fecha_hora,
      };
      return fromModelToVuelo(vuelosModel);
    },
  },
};
