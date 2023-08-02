const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  host: "localhost",
  user: "postgress",
  password: "123456",
  database: "softjobs",
  allowExitOnIdle: true,
});

const registrarUsuario = async (usuario) => {
  try {
    let { email, password, rol, lenguage } = usuario;
    const passwordEncriptada = await bcrypt.hash(password, 10);
    password = passwordEncriptada;
    const values = [email, passwordEncriptada, rol, lenguage];
    const consulta =
      "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4) RETURNING *";
    const {
      rows: [usuarioCreado],
    } = await pool.query(consulta, values);
    delete usuarioCreado.password;
    return usuarioCreado;
  } catch (error) {
    throw error;
  }
};

const obtenerDatosUsuario = async (email) => {
  const values = [email];
  const consulta = "SELECT * FROM usuarios WHERE email = $=1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  if (!rowCount) {
    throw { code: 404, message: "No existe usuario con este mail asociado🥺" };
  }

  delete usuario.password;
  return usuario;
};

const verificarCredenciales = async (email, password) => {
  const values = [email];
  const consulta = "SELECT password FROM usuarios WHERE email = $1";
  const {
    rows: [usuario],
    rowCount,
  } = await pool.query(consulta, values);

  if (!rowCount || !usuario) {
    throw { code: 401, message: "Email o contraseña es incorrecta🥺" };
  }
  const { password: passwordEncriptada } = usuario;
  const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada);

  if (!passwordEsCorrecta) {
    throw { code: 401, message: "Email o contraseña es incorrecta🥺" };
  }

  return true;
};

module.exports = {
  registrarUsuario,
  obtenerDatosUsuario,
  verificarCredenciales,
};
