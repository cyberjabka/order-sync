const { getResult } = require("../lib");
module.exports = async (req, res) => {
  try { res.setHeader("access-control-allow-origin", "*"); res.status(200).json(await getResult()); }
  catch (e) { res.status(502).json({ error: String(e.message) }); }
};
