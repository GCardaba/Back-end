import { ObjectId } from "mongodb";

export type LibroModel = {
  _id: ObjectId;
  titulo: string;
  autores: ObjectId[];
  copiasDisponibles: number;
};

export type AutorModel = {
  _id: ObjectId;
  nombre: string;
  biografia: string;
};
