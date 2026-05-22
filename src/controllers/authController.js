const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const login = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('usuario', usuario)
      .single();

    if (error || !data) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const passwordValido = await bcrypt.compare(password, data.password);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: data.id, usuario: data.usuario },
      process.env.JWT_SECRET || 'secreto123',
      { expiresIn: '8h' }
    );

    res.json({ token, usuario: data.usuario });
  } catch (err) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const registro = async (req, res) => {
  try {
    const { usuario, password } = req.body;

    if (!usuario || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ usuario, password: passwordHash }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'El usuario ya existe o hubo un error' });
    }

    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario: data.usuario });
  } catch (err) {
    console.error('ERROR REGISTRO:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { login, registro };