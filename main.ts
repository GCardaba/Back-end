import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { resolvers } from "./resolvers.ts";
import { schema } from "./schema.ts";
import { LibroModel, AutorModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Connected to MongoDB");

const mongoDB = client.db("practicaParcialB");

const contextLibros = mongoDB.collection<LibroModel>("libros");
const contextAutores = mongoDB.collection<AutorModel>("autor");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ contextLibros, contextAutores }),
});
console.log(`🚀 Server ready at ${url}`);
