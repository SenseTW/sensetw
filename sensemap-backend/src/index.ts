import * as dotenv from 'dotenv';
dotenv.config()

import { registerServer } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server';
import { app } from './app';
import { typeDefs, resolvers } from './types'
import { context } from './context';

const PORT = 8000;

const server = new ApolloServer({ typeDefs, resolvers, context });
registerServer({ server, app });
app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
