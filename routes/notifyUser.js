import express from 'express';
const Router = express.Router();

import {rentMessage} from '../controllers/notify/rentMessage.js';
import {inviteTo, inviteFrom} from '../controllers/invitation/from_to.js';

Router.post('/discord',rentMessage);
Router.post('/to',inviteTo);
Router.post('/from',inviteFrom);

export default Router;