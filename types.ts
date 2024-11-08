import { OptionalId } from "mongodb";

export type UserModel = OptionalId<{
  nombre: string;
  email: string;
  telefono: string;
  amigos: UserModel[];
}>;
export type User = {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  amigos: UserModel[];
};
