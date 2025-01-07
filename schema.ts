export const schema = `#graphql

type Libro {
    id: ID!
    titulo: String!,
    autores: [String!]!,
    copiasDisponibles : Int!
}

input libroCreateInput {
    titulo: String!,
    autores: [String!]!,
    copiasDisponibles : Int!
}
input libroUpdateInput {
    titulo: String!,
    autores: [String!],
    copiasDisponibles : Int
}

type Autor{
    id: ID!,
    nombre: String!,
    biografia: String!
}

input autorCreateInput {
    nombre: String!,
    biografia: String!
}

input autorUpdateInput {
    nombre: String!,
    biografia: String
}

 type Query { 
    Libros(input: String) : [Libro!]! 
    Autores: [Autor!]!

},
 type Mutation {
    createLibro(input: libroCreateInput!): Libro!
    updateLibro(id: ID!, input: libroUpdateInput!): Libro!
    deleteLibro(id: ID!): Boolean!

    createAutor(input: autorCreateInput!): Autor!
    updateAutor(id: ID!, input: autorUpdateInput!): Autor!
    deleteAutor(id: ID!): Boolean!

}

`;
