import nodemailer from 'nodemailer';

export async function POST({ request }) {
  const { email, password } = await request.json();

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail', // ou votre service d'email
      auth: {
        user: 'lolodevweb@gmail.com', // Remplacez par votre email
        pass: 'zlzz zyws sdmi jujf'    // Remplacez par votre mot de passe ou token
      }
    });

    const mailOptions = {
      from: 'lolodevweb@gmail.com',
      to: email,
      subject: 'Vos identifiants Demo Beta',
      text: `Bonjour,\n\nVoici vos identifiants pour accéder à la démo :\nEmail : ${email}\nMot de passe : ${password}\n\nCordialement,\nL'équipe.`
    };

    await transporter.sendMail(mailOptions);
    return new Response('Email envoyé avec succès.', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return new Response('Erreur lors de l\'envoi de l\'email.', { status: 500 });
  }
}
