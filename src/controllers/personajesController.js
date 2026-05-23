const supabase = require('../config/database');

// GET /personajes — todos
const getPersonajes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('personajes')
      .select(`*, animes(nombre)`)
      .order('id');

    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /personajes/:nombre?anime=X
const getPersonajeByNombre = async (req, res) => {
  try {
    const { nombre } = req.params;
    const { anime } = req.query;

    let animeId = null;

    if (anime) {
      const { data: animeData, error: animeError } = await supabase
        .from('animes')
        .select('id')
        .ilike('nombre', `%${anime}%`)
        .single();

      if (animeError || !animeData) {
        return res.status(404).json({ 
          success: false, 
          error: `Anime "${anime}" no encontrado` 
        });
      }
      animeId = animeData.id;
    }

    let query = supabase
      .from('personajes')
      .select(`*, animes(id, nombre)`)
      .ilike('nombre', `%${nombre}%`);

    if (animeId) {
      query = query.eq('anime_id', animeId);
    }

    const { data, error } = await query;

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: `Personaje "${nombre}" no encontrado${anime ? ` en ${anime}` : ''}` 
      });
    }

    res.json({ success: true, data: data[0] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /personajes/anime/:anime
const getPersonajesByAnime = async (req, res) => {
  try {
    const { anime } = req.params;

    const { data: animeData, error: animeError } = await supabase
      .from('animes')
      .select('id, nombre')
      .ilike('nombre', `%${anime}%`)
      .single();

    if (animeError || !animeData) {
      return res.status(404).json({ 
        success: false, 
        error: 'Anime no encontrado' 
      });
    }

    const { data, error } = await supabase
      .from('personajes')
      .select('*')
      .eq('anime_id', animeData.id)
      .order('nombre');

    if (error) throw error;

    res.json({ success: true, anime: animeData.nombre, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// GET /personajes/:id/imagenes
const getImagenesByPersonaje = async (req, res) => {
  try {
    const { id } = req.params;

    const { data: personaje, error: pError } = await supabase
      .from('personajes')
      .select('id, nombre')
      .eq('id', id)
      .single();

    if (pError || !personaje) {
      return res.status(404).json({ 
        success: false, 
        error: 'Personaje no encontrado' 
      });
    }

    const { data, error } = await supabase
      .from('imagenes')
      .select('*')
      .eq('personaje_id', id)
      .order('orden');

    if (error) throw error;

    res.json({ 
      success: true, 
      personaje: personaje.nombre,
      total: data.length,
      data 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// POST /personajes — crear personaje con imágenes
const crearPersonaje = async (req, res) => {
  try {
    const { nombre, edad, poder, anime_id, imagenes } = req.body;

    if (!nombre || !anime_id) {
      return res.status(400).json({ error: 'Nombre y anime_id son requeridos' });
    }

    const { data: personaje, error: pError } = await supabase
      .from('personajes')
      .insert([{ nombre, edad, poder, anime_id }])
      .select()
      .single();

    if (pError) throw pError;

    if (imagenes && imagenes.length > 0) {
      const imagenesData = imagenes.map((url, index) => ({
        personaje_id: personaje.id,
        url,
        orden: index + 1
      }));

      const { error: iError } = await supabase
        .from('imagenes')
        .insert(imagenesData);

      if (iError) throw iError;
    }

    res.status(201).json({ success: true, data: personaje });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// PUT /personajes/:id — actualizar personaje
const actualizarPersonaje = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, edad, poder, anime_id } = req.body;

    const { data, error } = await supabase
      .from('personajes')
      .update({ nombre, edad, poder, anime_id })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) return res.status(404).json({ error: 'Personaje no encontrado' });

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE /personajes/:id — eliminar personaje
const eliminarPersonaje = async (req, res) => {
  try {
    const { id } = req.params;

    await supabase.from('imagenes').delete().eq('personaje_id', id);

    const { error } = await supabase
      .from('personajes')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ success: true, mensaje: 'Personaje eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { 
  getPersonajes, 
  getPersonajeByNombre, 
  getPersonajesByAnime, 
  getImagenesByPersonaje,
  crearPersonaje,
  actualizarPersonaje,
  eliminarPersonaje
};