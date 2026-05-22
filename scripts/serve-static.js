const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const requestedDir = process.argv[2] || "dist";
const port = Number(process.argv[3] || 4173);
const publicDir = path.resolve(rootDir, requestedDir);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
};

if (!publicDir.startsWith(rootDir)) {
  throw new Error("Refusing to serve files outside the project directory.");
}

if (!fs.existsSync(publicDir)) {
  throw new Error(`Directory does not exist: ${path.relative(rootDir, publicDir)}`);
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const safePath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.resolve(publicDir, `.${safePath}`);

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const targetPath = fs.existsSync(filePath) && fs.statSync(filePath).isFile()
    ? filePath
    : path.join(publicDir, "index.html");
  const extension = path.extname(targetPath).toLowerCase();

  response.writeHead(200, {
    "Content-Type": contentTypes[extension] || "application/octet-stream",
    "X-Content-Type-Options": "nosniff",
  });
  fs.createReadStream(targetPath).pipe(response);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving ${path.relative(rootDir, publicDir)} at http://127.0.0.1:${port}`);
});
