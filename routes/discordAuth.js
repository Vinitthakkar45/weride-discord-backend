import express from 'express';
const Router = express.Router();

import {discordAuth, discordCallback} from '../controllers/auth/discord.js';

Router.get('/discord',discordAuth);
Router.get('/discord/callback',discordCallback);

export default Router;