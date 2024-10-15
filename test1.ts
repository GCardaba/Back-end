const users =[ 
    {
    name : "Gabriel",
    email : "aaa@gmail.com",
    age : 19
  },
  
  {
    name : "Juan",
    email : "juana@gmail.com",
    age : 16
  },
  {
    "name": "María",
    "email": "maria2@gmail.com",
    "age": 18
  },
  {
    "name": "Pedro",
    "email": "pedro3@gmail.com",
    "age": 20
  },
  {
    "name": "Ana",
    "email": "ana4@gmail.com",
    "age": 22
  },
  {
    "name": "Luis",
    "email": "luis5@gmail.com",
    "age": 17
  },
  {
    "name": "Carla",
    "email": "carla6@gmail.com",
    "age": 19
  },
  {
    "name": "Miguel",
    "email": "miguel7@gmail.com",
    "age": 23
  },
  {
    "name": "Sofía",
    "email": "sofia8@gmail.com",
    "age": 21
  },
  {
    "name": "Daniel",
    "email": "daniel9@gmail.com",
    "age": 24
  },
  {
    "name": "Laura",
    "email": "laura10@gmail.com",
    "age": 16
  }
 ];

 
 const handler = (req: Request): Response => {
    const url = new URL(req.url);
    const path = url.pathname;


    if( path === "/users/gabriel"){
        return new Response(`Has buscado a ${users[0].name}`);
    }
    else if( path === "/users/juan"){
        return new Response(JSON.stringify(users[1]));
    }

    return new Response(`La ruta es: ${url.host} -- ${url.pathname}`);
};

Deno.serve({port: 3000, handler});
