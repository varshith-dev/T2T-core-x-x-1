// Local Postgres for dev — real Postgres binaries, no system install, no admin.
// Data lives in apps/api/.pgdata (gitignored). Keep this running while developing.
import EmbeddedPostgres from "embedded-postgres";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", ".pgdata");

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: "postgres",
  password: "postgres",
  port: 5433,
  persistent: true,
});

if (!fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
  console.log("initialising postgres data dir...");
  await pg.initialise();
}
await pg.start();
console.log("postgres started on port 5433");

try {
  await pg.createDatabase("t2t");
  console.log("created database 't2t'");
} catch {
  console.log("database 't2t' already exists (ok)");
}
console.log("READY -> postgres://postgres:postgres@localhost:5433/t2t");

const shutdown = async () => {
  console.log("stopping postgres...");
  await pg.stop();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
setInterval(() => {}, 1 << 30); // keep process alive
