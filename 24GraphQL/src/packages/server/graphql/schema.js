const { buildSchema } = require( 'graphql' );

/** Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의 */
module.exports = buildSchema( `
    type Post {
        _id : ID!
        title : String!
        content : String!
        imageUrl : String!
        creator : User!
        createdAt : String!
        updatedAt : String!
    }

    type User {
        _id : ID!
        name : String!
        email : String!
        password : String
        status : String!
        posts : [Post!]!
    }
    
    type AuthData {
        token : String!
        userId : String!
    }

    input UserInputData {
        email : String!
        name : String!
        password : String!
    }
    
    type RootQuery {
        login( email : String!, password : String! ) : AuthData!
    }

    type RootMutation {
        createUser( userInput : UserInputData ): User!
    }
    
    schema {
        query : RootQuery
        mutation : RootMutation
    }
` );