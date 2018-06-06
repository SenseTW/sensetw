import { registerServer } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server';
import { app } from './app';
import { typeDefs, resolvers } from './types'

const PORT = 8000;

const server = new ApolloServer({ typeDefs, resolvers });
registerServer({ server, app });
app.listen(PORT);
