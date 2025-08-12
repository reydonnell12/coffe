const express = require("express");
const path = require("path");
const nodemailer = require("nodemailer");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Ruta para procesar el formulario y enviar correo
app.post("/contacto", (req, res) => {
  const { nombre, email, mensaje } = req.body;

  // Configura el transporte de correo
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // <-- desde variables de entorno
      pass: process.env.EMAIL_PASS, // <-- desde variables de entorno
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO, // puedes poner varios separados por coma
    subject: `Nuevo mensaje de ${nombre}`,
    text: `
    Nombre: ${nombre}
    Email: ${email}
    Mensaje: ${mensaje}
  `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Error al enviar el mensaje.");
    } else {
      console.log("Correo enviado: " + info.response);
      res.send("Mensaje enviado con éxito.");
    }
  });
});

app.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
