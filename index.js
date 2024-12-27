import express from 'express'; 
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json()); 

import auth from './routes/discordAuth.js';
import notify from './routes/notifyUser.js';

app.use('/auth', auth);
app.use('/notify', notify);
app.use('/invite', notify);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;