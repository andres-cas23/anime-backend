const supabase = require('../config/database');

const listar = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('animes')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const obtenerPorCategoria = async (req, res) => {
  try {
    const { categoria_id } = req.params;
    const { data, error } = await supabase
      .from('animes')
      .select('*')
      .eq('categoria_id', categoria_id)
      .order('id', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const crear = async (req, res) => {
  try {
    const { nombre, descripcion, categoria_id } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    const { data, error } = await supabase
      .from('animes')
      .insert([{ nombre, descripcion, categoria_id }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, categoria_id } = req.body;

    const { data, error } = await supabase
      .from('animes')
      .update({ nombre, descripcion, categoria_id })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Anime no encontrado' });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('animes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ mensaje: 'Anime eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listar, obtenerPorCategoria, crear, actualizar, eliminar };