import { MongoClient, Collection } from "mongodb";
import { User, UserModel } from "./types.ts";

export const fromModelToUser = async (
  Model: UserModel,
  UserCollection: Collection<UserModel>
): Promise<User> => {
  const amigosModel = await UserCollection.find({
    _id: { $in: Model.amigos },
  }).toArray();
  return {
    id: Model._id!.toString(),
    nombre: Model.nombre,
    email: Model.email,
    telefono: Model.telefono,
    amigos: amigosModel,
    //amigos: amigosModel.map((u: UserModel) => fromModelToUser(u)),
  };
};
