/** Query , Mutation, Subscription 등 GraphQL 서비스 유형 정의 */
const { buildSchema } = require( 'graphql' );

module.exports = buildSchema( `
    type TestData {
        text : String!
        views : Int!
    }

    type RootQuery {
        hello: TestData
    }
    
    schema {
        query: RootQuery
    }
` );