const supabase = require('../config/supabase');

const getAnimes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('animes')
      .select('*')
      .order('id');

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = { getAnimes };