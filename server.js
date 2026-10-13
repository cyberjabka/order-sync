const http = require("http");
const { getResult } = require("./lib");
http.createServer(async (req, res) => {
  const p = req.url.split("?")[0];
  if (p === "/" || p === "/result" || p === "/api/result") {
    try {
      const body = JSON.stringify(await getResult());
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", "access-control-allow-origin": "*" });
      res.end(body);
    } catch (e) {
      res.writeHead(502, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: String(e.message) }));
    }
  } else { res.writeHead(404); res.end("not found"); }
}).listen(process.env.PORT || 3000);
