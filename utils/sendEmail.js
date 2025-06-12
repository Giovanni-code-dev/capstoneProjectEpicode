// utils/sendEmail.js

import sgMail from '@sendgrid/mail'

// Inizializza la chiave API
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Funzione per inviare email
export const sendEmail = async ({ to, subject, text, html }) => {
  const msg = {
    to,
    from: 'giovanni.dellelenti@gmail.com', // Sostituibile con indirizzo autorizzato da SendGrid
    subject,
    text,
    html,
  }

  return await sgMail.send(msg)
}
