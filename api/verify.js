const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();

    const { password } = req.body;
    const CORRECT_PASSWORD = process.env.MASTER_PASSWORD;

    if (password === CORRECT_PASSWORD) {
        return res.status(200).json({ success: true });
    } else {
        // Logic to send email alert
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'YOUR_EMAIL@gmail.com', // PUT YOUR GMAIL HERE
                    pass: process.env.EMAIL_PASS   // Uses the 16-char App Password
                }
            });

            await transporter.sendMail({
                from: 'ziejhaycantalejo0909@gmail.com',
                to: 'ziejhaycantalejo0909@gmail.com',
                subject: '⚠️ Security Alert: Failed Login',
                text: 'Someone entered the wrong password on your dashboard.'
            });
        } catch (error) {
            console.error("Email failed:", error);
        }

        return res.status(401).json({ success: false });
    }
}
