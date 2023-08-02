const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

const checkCredentialsExists = (req, res, next) => {
  try {
    const { email, password, rol, lenguage } = req.body;

    if (!email || !password || !rol || !lenguage) {
      return res
        .status(401)
        .send({ message: "NO SE TIENE LAS CREDENCIALES CORRECTAS" });
    }
    next();
  } catch (error) {
    console.error("ERROR EN CONSULTA:", error.message);
    next(error);
  }
};

const tokenVerification = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token || !token.startsWith("Bearer")) {
      throw {
        code: 401,
        message: "ACCESO NO AUTORIZADO",
      };
    }

    const tokenValue = token.split(" ")[1];
    const decodedToken = jwt.verify(tokenValue, secretKey);
    req.user = decodedToken;

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkCredentialsExists,
  tokenVerification,
};
