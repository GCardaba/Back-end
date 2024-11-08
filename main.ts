import "https://deno.land/x/dotenv@v3.2.0/load.ts";
import { MongoClient } from "mongodb";
import { example, exampleModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  console.log("MONGO_URL not set");
  Deno.exit(1);
}
const client = new MongoClient(MONGO_URL);

// Database Name
const dbName = "NebrijaDB";
await client.connect();
console.log("Connected successfully to server");
const db = client.db(dbName);

const exampleCollection = db.collection<exampleModel>("example");

const handler = async (req: Request): Promise<Response> => {
  const method = req.method;
  const url = new URL(req.url);
  if (method === "GET") {
  } else if (method === "PUSH") {
  } else if (method === "PUT") {
  } else if (method === "DELETE") {
  }

  return new Response("Endpoint not found", { status: 404 });
};
Deno.serve({ port: 3000 }, handler);
