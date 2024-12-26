import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendInvite = async function sendInvite(imagePath, name, email, status) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
            secure: false,
        });

        const imageCid = `invitationImage_${new Date().getTime()}`;
        let mailData;
        if (status) {
            mailData = {
                from: `WeRide Invitations <${process.env.EMAIL_ID}>`,
                to: email,
                subject: `You're Invited to Join WeRide! 🚲`,
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h1 style="color: #4CAF50;">Welcome to WeRide!</h1>
                        <p>We are thrilled to invite you to be a part of <strong>WeRide</strong>, your go-to platform for renting and sharing bikes or scooters effortlessly.</p>
                        
                        <!-- Embedded Image -->
                        <img src="cid:${imageCid}" alt="WeRide Invitation" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;" />
    
                        <p style="font-size: 16px; margin: 20px 0;">Click the link below to explore our platform and start riding today:</p>
                        <a href="https://www.weride.live" style="background-color: #4CAF50; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 5px; font-size: 16px;">
                            Visit WeRide
                        </a>
    
                        <p style="margin-top: 30px; font-size: 14px; color: #888;">Thank you for choosing WeRide. See you on the ride!</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `${name}_invitation.png`,
                        path: imagePath,
                        cid: imageCid,
                    }
                ],
            };
        } else {
            mailData = {
                from: `WeRide Invitations <${process.env.EMAIL_ID}>`,
                to: email,
                subject: `Your WeRide Invite Card is Ready! 🚲`,
                html: `
                    <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                        <h1 style="color: #4CAF50;">Your Personalized WeRide Invite!</h1>
                        <p>Here's your very own invite card from <strong>WeRide</strong>, the ultimate platform for renting and sharing bikes or scooters effortlessly.</p>
                        
                        <!-- Embedded Image -->
                        <img src="cid:${imageCid}" alt="WeRide Invitation" style="width: 100%; max-width: 600px; margin: 20px auto; display: block;" />
            
                        <p style="font-size: 16px; margin: 20px 0;">Save this card and share it with your friends to spread the joy of WeRide!</p>
            
                        <p style="margin-top: 30px; font-size: 14px; color: #888;">Thank you for being a part of WeRide. Keep riding!</p>
                    </div>
                `,
                attachments: [
                    {
                        filename: `${name}_invitation.png`,
                        path: imagePath,
                        cid: imageCid,
                    }
                ],
            };
        }
        await transporter.sendMail(mailData);
    } catch (err) {
        console.error('Error sending invitation email:', err);
        throw err;
    }
}

export { sendInvite }
