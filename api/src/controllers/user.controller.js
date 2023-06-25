import { User, Code } from "../model/index.model.js";
import bcrypt from "bcrypt";
import { createToken } from "../jwt/jwt.js";
import nodemailer from "nodemailer";

export const addUser = async (req, res) => {
  const password = req.body.password;
  const { email, username, name, surname, age, role } = req.body;

  const userEmail = await User.findOne({
    where: {
      email,
    },
  });

  if (!userEmail) {
    const UserSurname = await User.findOne({
      where: {
        username,
      },
    });
    if (!UserSurname) {
      bcrypt.hash(password, 8, async (err, hash) => {
        if (err) {
          res.send(500).json({ msg: "internal server error" });
        } else {
          const newUser = await User.create({
            email,
            username,
            password: hash,
            name,
            surname,
            age,
            role,
          });
          res.status(200).send(newUser);
        }
      });
    } else {
      res.status(404).json({
        msg: `el usuario con el username ${username} ya esta registrado, por favor intentar con otro username`,
      });
    }
  } else {
    res.status(404).json({
      msg: `el usuario con el correo ${email} ya esta registrado, por favor intentar con otro correo`,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (user) {
    bcrypt.compare(password, user.password, (err, check) => {
      if (err) {
        res.status(500).json({ msg: "internal server error" });
      } else {
        if (check) {
          res.status(200).json({
            token: createToken(user),
            user,
          });
        } else {
          res
            .status(500)
            .json({ msg: "password incorrecta, vuelve a intentarlo" });
        }
      }
    });
  } else {
    res.status(404).json({ msg: "el usuario no existe, porfavor registrese" });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByPk(id);
  user.set(req.body);
  await user.save();
  res.status(200).json(user);
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.destroy({
      where: {
        id,
      },
    });
    res.status(200).json({ msg: "user eliminado" });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export const codeEmail = async (req, res) => {
  //recuperamos email desde el cuerpo de la peticion
  const { email } = req.body;
  //generamos un numero random
  var codigo = Math.floor(Math.random() * (99000 - 10000) + 10000);
  //pasamos el codigo a positivo en caso de ser negativo
  if (codigo < 0) {
    codigo = codigo * -1;
  }
  // try cath
  try {
    //verificamos si el correo pasado por la peticion esta registrado en la DB
    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      throw "usuario no registrado";
    }
    //verificamos si el user ya posee un codigo activo, en caso correcto se eliminara para agregar el nuevo
    const veryCode = await Code.findOne({
      where: {
        userId: user.id,
      },
      include: User,
    });

    if (veryCode) {
      await Code.destroy({
        where: {
          userId: user.id,
        },
      });
    }

    //conexion nodemailer a correo google
    const transporte = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "goliamhelp@gmail.com",
        pass: "zjdfxlygqgtdxfnz", //password: zjdfxlygqgtdxfnz
      },
    });
    //la options del correo a enviar
    var mailOptions = {
      from: "Remitente",
      to: email,
      subject: "Recuperacion de contraseña",
      html: `
      <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <style>
                .h1-test{
                  color: rgb(4, 4, 240);
                }
            </style>
        </head>
        <body>
            <h1 class="h1-test">para recuperar tu contraseña usa este codigo ${codigo}</h1>
        </body>
        </html>
      `,
    };
    //mensaje enviado
    await transporte.sendMail(mailOptions);
    //guardamos el codigo a la DB junto con el id del user
    const newCode = await Code.create({
      code: codigo,
      userId: user.id,
    });

    res.status(200).json(newCode);
  } catch (error) {
    //captura de errores
    res.status(500).send(error);
  }
};

export const veryficateCode = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
