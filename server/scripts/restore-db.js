const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in server/.env');
  process.exit(1);
}

const fileArg = process.argv.find((a) => a.startsWith('--file='));
const filePath = fileArg ? fileArg.split('=').slice(1).join('=') : null;
if (!filePath) {
  console.error('Usage: node scripts/restore-db.js --file=server/backups/<backup>.sql|.dump');
  process.exit(1);
}

let dbUrl;
try {
  dbUrl = new URL(String(DATABASE_URL).replace(/^"+|"+$/g, ''));
} catch {
  console.error('Invalid DATABASE_URL:', DATABASE_URL);
  process.exit(1);
}

const host = dbUrl.hostname || 'localhost';
const port = dbUrl.port || '5432';
const user = decodeURIComponent(dbUrl.username || 'postgres');
const password = decodeURIComponent(dbUrl.password || '');
const dbName = (dbUrl.pathname || '').replace(/^\//, '');

if (!dbName) {
  console.error('Could not determine database name from DATABASE_URL');
  process.exit(1);
}

const isCustom = filePath.toLowerCase().endsWith('.dump');

const cmd = isCustom ? 'pg_restore' : 'psql';
const restoreArgs = isCustom
  ? [
      '--host',
      host,
      '--port',
      String(port),
      '--username',
      user,
      '--dbname',
      dbName,
      '--no-owner',
      '--clean',
      '--if-exists',
      filePath,
    ]
  : ['--host', host, '--port', String(port), '--username', user, '--dbname', dbName, '--file', filePath];

console.log(`Restoring into PostgreSQL database "${dbName}" from: ${filePath}`);
console.log(`Using ${cmd}. This will modify the target DB.`);

const child = spawn(cmd, restoreArgs, {
  stdio: 'inherit',
  env: {
    ...process.env,
    PGHOST: host,
    PGPORT: String(port),
    PGUSER: user,
    ...(password ? { PGPASSWORD: password } : {}),
  },
});

child.on('close', (code) => {
  if (code === 0) {
    console.log('Restore completed.');
    process.exit(0);
  }
  console.error(`${cmd} exited with code ${code}`);
  process.exit(code || 1);
});

