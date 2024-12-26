import fs from 'fs';
import {generateImage} from './generateImage.js';
import {sendInvite} from './sendInvite.js';

const inviteTo = async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required." });
    }

    try {
        const outputPath = await generateImage('./controllers/invitation/template_to.png', name);
        await sendInvite(outputPath, name, email, true);
        fs.unlinkSync(outputPath);

        res.status(200).json({ message: `Invitation sent to ${email}.` });
    } catch (err) {
        res.status(500).json({ message: "Failed to send invitation.", error: err.message });
    }
}

const inviteFrom = async (req, res) => {
    const { email, name } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required." });
    }

    try {
        const outputPath = await generateImage('./controllers/invitation/template_from.png', name);
        await sendInvite(outputPath, name, email, false);
        fs.unlinkSync(outputPath);

        res.status(200).json({ message: `Invitation sent to ${email}.` });
    } catch (err) {
        res.status(500).json({ message: "Failed to send invitation.", error: err.message });
    }
}

export {inviteTo, inviteFrom};