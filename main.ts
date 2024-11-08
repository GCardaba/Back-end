import "https://deno.land/x/dotenv@v3.2.0/load.ts"; //include para el .env
import { MongoClient, OptionalId } from "mongodb";
import { fromModelToUser } from "./resolvers.ts";
import { User, UserModel } from "./types.ts";

const url = Deno.env.get("MONGO_URL");
if (!url) {
  console.log("Url not set");
  Deno.exit(1);
}
const client = new MongoClient(url);

const dbName = "NebrijaDB";

await client.connect();
console.log("Connected successfully to server");
const db = client.db(dbName);

const UserCollection = db.collection<UserModel>("user");

const handler = async (req: Request): Promise<Response> => {
  const url = new URL(req.url);
  const method = req.method;

  if (method === "GET") {
    const path = url.pathname;
    const searchParams = url.searchParams;
    if (path === "/persona") {
      if (url.searchParams.get("email")) {
        const mail = url.searchParams.get("email")?.toString();
        const emailDB = await UserCollection.find(email: {$in: mail}).toArray();
        const users = await Promise.all(
          emailDB.map((u) => fromModelToUser(u, UserCollection))
        );

        return new Response(JSON.stringify(users), { status: 201 });
      }
    } else if (path === "/personas") {
      if (!searchParams) {
        const userDB = await UserCollection.find().toArray();
        const users = await Promise.all(
          userDB.map((u) => fromModelToUser(u, UserCollection))
        );

        return new Response(JSON.stringify(users), { status: 201 });
      }
    }
  } else if (method === "PUT") {
  } else if (method === "POST") {
    /*
    const path = url.pathname;
    if (path === "/personas"){
      const user = await req.json();
      if (!user.nombre || !user. email || !user.telefono){
        return new Response("Falta informacion. Push no completado" ,{ status: 400});
      }
      
      const hay = await UserCollection.findOne({email: user.email});
      if (hay){
        return new Response("Usuario ya existente", { status: 400});
      }
      const amigos: UserModel[] = [];

      const result = await UserCollection.insertOne({
        _id: OptionalId,
        name: user.name,
        email: user.email,
        telefono: user.telefono,
        amigos: amigos
      });
      return new Response(JSON.stringify(result), {status: 201} 
        )
    }*/
  } else if (method === "DELETE") {
  }

  return new Response("Endpoint not t", { status: 404 });
};

Deno.serve({ port: 3000 }, handler);
