import { Collection, ObjectId } from "mongodb";
import type { AutorModel, LibroModel } from "./types.ts";

type context = {
  contextLibros: Collection<LibroModel>;
  contextAutores: Collection<AutorModel>;
};

type libroCreateInput = {
  titulo: string;
  autores: [string];
  copiasDisponibles: number;
};
type libroUpdateInput = {
  titulo: string;
  autores?: [string];
  copiasDisponibles?: number;
};

type autorCreateInput = {
  nombre: string;
  biografia: string;
};

type autorUpdateInput = {
  nombre: string;
  biografia: string;
};

export const resolvers = {
  Libro: {
    id: (parent: LibroModel) => {
      return parent._id.toString();
    },
    titulo: (parent: LibroModel) => {
      return parent.titulo;
    },
    autores: async (
      parent: LibroModel,
      _: unknown,
      context: context
    ): Promise<AutorModel[]> => {
      const autores = await context.contextAutores
        .find({ _id: { $in: parent.autores } })
        .toArray();
      return autores;
    },
    copiasDisponibles: (parent: LibroModel) => {
      return parent.copiasDisponibles;
    },
  },

  Autor: {
    id: (parent: AutorModel) => {
      return parent._id.toString();
    },
    nombre: (parent: AutorModel) => {
      return parent.nombre;
    },
    biografia: (parent: AutorModel) => {
      return parent.biografia;
    },
  },
  Query: {
    Libros: async (
      _: unknown,
      { input }: { input?: string },
      context: context
    ): Promise<LibroModel[]> => {
      let libros = [];
      if (input) {
        const autor = await context.contextAutores.findOne({ nombre: input });
        libros = await context.contextLibros
          .find({
            $or: [{ titulo: input }, { autores: new ObjectId(autor?._id) }],
          })
          .toArray();
      } else {
        libros = await context.contextLibros.find({}).toArray();
      }
      return libros;
    },
    Autores: async (
      _: unknown,
      __: unknown,
      context: context
    ): Promise<AutorModel[]> => {
      return await context.contextAutores.find({}).toArray();
    },
  },
  Mutation: {
    createLibro: async (
      _: unknown,
      input: libroCreateInput,
      context: context
    ): Promise<LibroModel | null> => {
      //Comprobacion de que existe el libro
      const titulo = await context.contextLibros.findOne({ input });
      if (titulo) throw Error("El libro ya existe");
      //Comporbacion de que existen los autores
      const autores = input.autores.map((u) => new ObjectId(u));
      const autoresExistentes = await context.contextAutores
        .find({ _id: { $in: autores } })
        .toArray();
      const autoresNoExistentes = autoresExistentes.filter(
        (autor) => !autores.some((autorId) => autor._id.equals(autorId))
      );

      // Insertar solo los autores que no existen en la base de datos
      if (autoresNoExistentes.length > 0) {
        await Promise.all(
          autoresNoExistentes.map(async (autor) => {
            // Inserta los autores que no están en la base de datos
            await context.contextAutores.insertOne({
              _id: new ObjectId(),
              nombre: autor.nombre, // Aquí puedes usar el nombre real si lo tienes
              biografia: `Autor del libro ${titulo}`,
            });
          })
        );
      }
      const Libro = {
        _id: new ObjectId(),
        titulo: input.titulo,
        autores: autores,
        copiasDisponibles: input.copiasDisponibles,
      };
      const { insertedId } = await context.contextLibros.insertOne(Libro);
      if (!insertedId) throw new Error("No se ha insertado el libro");
      return Libro;
    },

    updateLibro: async (
      _: unknown,
      input: libroUpdateInput,
      context: context
    ): Promise<LibroModel | null> => {
      const { titulo, autores, copiasDisponibles } = input;
      const hayLibro = await context.contextLibros.findOne({ titulo });
      if (!hayLibro) throw new Error(`No existe el libro llamado ${titulo}`);
      const autoresId = autores?.map((u) => new ObjectId(u));
      const Libro = await context.contextLibros.findOneAndUpdate(
        { titulo },
        {
          $set: {
            titulo: titulo,
            autores: autoresId,
            copiasDisponibles: copiasDisponibles,
          },
        },
        { returnDocument: "after" }
      );
      return Libro;
    },

    deleteLibro: async (
      _: unknown,
      { id }: { id: string },
      context: context
    ): Promise<boolean> => {
      const libro = await context.contextLibros.findOne({
        _id: new ObjectId(id),
      });
      if (!libro) throw new Error(`No existe el libro con id ${id}`);
      const { deletedCount } = await context.contextLibros.deleteOne({
        _id: new ObjectId(id),
      });
      if (deletedCount === 0)
        throw new Error(`No se ha eliminado el libro con id ${id}`);
      return true;
    },

    createAutor: async (
      _: unknown,
      input: autorCreateInput,
      context: context
    ): Promise<AutorModel | null> => {
      const hayAutor = await context.contextAutores.findOne({
        nombre: input.nombre,
      });
      if (hayAutor)
        throw new Error(`Ya existe un autor llamado ${input.nombre}`);
      const Autor = {
        _id: new ObjectId(),
        nombre: input.nombre,
        biografia: input.biografia,
      };
      const { insertedId } = await context.contextAutores.insertOne(Autor);
      if (!insertedId) throw new Error("No se ha insertado el autor");
      return Autor;
    },

    updateAutor: async (
      _: unknown,
      input: autorUpdateInput,
      context: context
    ): Promise<AutorModel | null> => {
      const { nombre, biografia } = input;
      const hayAutor = await context.contextAutores.findOne({
        nombre: nombre,
      });
      if (!hayAutor) throw new Error(`No existe un autor llamado ${nombre}`);
      const Autor = await context.contextAutores.findOneAndUpdate(
        { nombre: nombre },
        {
          $set: {
            nombre: nombre,
            biografia: biografia,
          },
        },
        {
          returnDocument: "after",
        }
      );
      return Autor;
    },

    deleteAutor: async (
      _: unknown,
      { id }: { id: string },
      context: context
    ): Promise<boolean> => {
      const autor = await context.contextAutores.findOne({
        _id: new ObjectId(id),
      });
      if (!autor) throw new Error(`No existe el autor con id ${id}`);
      const { deletedCount } = await context.contextAutores.deleteOne({
        _id: new ObjectId(id),
      });
      await context.contextLibros.updateMany(
        { autores: new ObjectId(id) },
        {
          $pull: {
            autores: new ObjectId(id),
          },
        }
      );
      if (deletedCount === 0)
        throw new Error(`No se ha eliminado el autor con id ${id}`);
      return true;
    },
  },
};
