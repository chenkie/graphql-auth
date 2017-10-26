require('dotenv').config();
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { makeExecutableSchema } = require('graphql-tools');
const { directiveResolvers, attachDirectives } = require('./directives');
const { attachUserToContext } = require('./middleware');
const { getArticlesForAuthor, addArticle } = require('./controllers');
const { checkAuthAndResolve, checkScopesAndResolve } = require('./resolvers');

const app = express();

let ARTICLES = require('./data/articles');

const port = 8080;
const typeDefs = `

  directive @isAuthenticated on QUERY | FIELD
  directive @hasScope(scope: [String]) on QUERY | FIELD

  type Article {
    id: ID!
    authorId: ID!
    authorName: String!
    articleName: String!
    link: String!
    review: Review
  }
  
  type Review {
    rating: Int
    comment: String
  }

  input ArticleInput {
    authorId: ID!
    authorName: String!
    articleName: String!
    link: String!
  }

  type Query {
    allArticles: [Article]
  }

  type Mutation {
    addArticle(input: ArticleInput): Article
  }
`;

const resolvers = {
  Query: {
    allArticles: (_, args, context) =>
      checkAuthAndResolve(context, getArticlesForAuthor)
  },
  Mutation: {
    addArticle: (_, { input }, context) => {
      checkScopesAndResolve(context, ['write:articles'], addArticle, input);
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

attachDirectives(schema);

// app.use(attachUserToContext);

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(port);
console.log(`App listening on localhost:${port}`);
