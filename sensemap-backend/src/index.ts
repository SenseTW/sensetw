import * as dotenv from 'dotenv';
dotenv.config()

import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import { registerServer } from 'apollo-server-express';
import { ApolloServer } from 'apollo-server';
import { typeDefs, resolvers } from './types'
import { context } from './context';
import { router as Login } from './login';
import { router as Hypothesis } from './hypothesis';

const PORT = 8000;

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: process.env.SESSION_SECRET || 'xeepe3uuT1Gieh2ig0Aoyoongie1vooTeloo0Oongieb5mear4pix4aSh2loiCei' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(Login(context));
app.use('/h/api', Hypothesis(context));

const server = new ApolloServer({ typeDefs, resolvers, context });
registerServer({ server, app });

app.listen(PORT, () => console.log(`Listening at port ${PORT}`));
