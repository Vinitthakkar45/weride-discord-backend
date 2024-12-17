import express from 'express';
const Router = express.Router();

import {rentMessage} from '../controllers/notify/rentMessage.js';

Router.post('/discord',rentMessage);

export default Router;