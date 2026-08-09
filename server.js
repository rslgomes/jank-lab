import http from "node:http";
import path from "node:path";
import fs from "node:fs";

const __rootDir = process.cwd();

const WATCH_PATHS = ["src"];

const RELOAD_DEBOUNCE_MS = 100;

function getContentType(pathname) {
  if (pathname.endsWith(".js")) return "application/javascript";
  if (pathname.endsWith(".json")) return "application/json";
  if (pathname.endsWith(".css")) return "text/css";
  if (pathname.endsWith(".html")) return "text/html";
  if (pathname.endsWith(".png")) return "image/png";
  return "text/plain";
}

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/html" });
  fs.readFile(path.join(__rootDir, "not_found/index.html"), (err, data) => {
    res.end(err ? "Not Found" : data);
  });
}

const LIVE_RELOAD_SCRIPT = `
<script>
  new EventSource("/__livereload").onmessage = () => location.reload();
</script>`;

function injectLiveReload(html) {
  if (html.includes("</body>")) {
    return html.replace("</body>", `${LIVE_RELOAD_SCRIPT}</body>`);
  }
  return html + LIVE_RELOAD_SCRIPT;
}

const sseClients = new Set();

function handleLiveReloadStream(req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  res.write("\n");
  sseClients.add(res);
  req.on("close", () => sseClients.delete(res));
}

function broadcastReload() {
  for (const client of sseClients) {
    client.write("data: reload\n\n");
  }
}

let reloadTimer = null;
function scheduleReload(changedPath) {
  clearTimeout(reloadTimer);
  reloadTimer = setTimeout(() => {
    console.log(`changed: ${changedPath} -> reloading`);
    broadcastReload();
  }, RELOAD_DEBOUNCE_MS);
}

function watchPaths(watchPaths) {
  for (const relPath of watchPaths) {
    const absPath = path.join(__rootDir, relPath);
    fs.watch(absPath, { recursive: true }, (_event, filename) => {
      scheduleReload(path.join(relPath, filename ?? ""));
    });
    console.log(`watching: ${relPath}`);
  }
}

function handleRequest(req, res) {
  const { url, method } = req;

  if (url === "/__livereload") {
    handleLiveReloadStream(req, res);
    return;
  }

  if (method !== "GET") {
    res.writeHead(405, { Allow: "GET" });
    res.end();
    return;
  }

  const pathname = url.split("?")[0];
  const urlPath = pathname === "/" ? "index.html" : pathname;
  const filePath = path.join(__rootDir, urlPath);

  if (!filePath.startsWith(__rootDir)) {
    send404(res);
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      send404(res);
      return;
    }
    const contentType = getContentType(urlPath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(contentType === "text/html" ? injectLiveReload(data.toString()) : data);
  });
}

watchPaths(WATCH_PATHS);

http.createServer(handleRequest).listen(3000);
