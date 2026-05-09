const supabase = require('../config/supabase');

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

module.exports = { 
  getPersonajes, 
  getPersonajeByNombre, 
  getPersonajesByAnime, 
  getImagenesByPersonaje 
};