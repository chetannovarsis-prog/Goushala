const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('Missing DATABASE_URL in server/.env');
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

const args = process.argv.slice(2);
const formatArg = args.find((a) => a.startsWith('--format='));
const format = (formatArg ? formatArg.split('=')[1] : 'plain').toLowerCase(); // plain | custom

const backupsDir = path.join(__dirname, '..', 'backups');
fs.mkdirSync(backupsDir, { recursive: true });

const stamp = new Date()
  .toISOString()
  .replace(/[:.]/g, '-')
  .replace('T', '_')
  .replace('Z', '');

const ext = format === 'custom' ? 'dump' : 'sql';
const outFile = path.join(backupsDir, `goushala_${dbName}_${stamp}.${ext}`);

const pgDumpArgs = [
  '--host',
  host,
  '--port',
  String(port),
  '--username',
  user,
  '--dbname',
  dbName,
  '--no-owner',
  '--no-privileges',
];

if (format === 'custom') {
  pgDumpArgs.push('--format=custom');
  pgDumpArgs.push('--file', outFile);
} else {
  pgDumpArgs.push('--format=plain');
}

console.log(`Backing up PostgreSQL database "${dbName}" to: ${outFile}`);
console.log('Using pg_dump. If this fails, ensure PostgreSQL bin is in PATH (pg_dump.exe).');

const child = spawn('pg_dump', pgDumpArgs, {
  stdio: format === 'custom' ? ['ignore', 'inherit', 'inherit'] : ['ignore', 'pipe', 'inherit'],
  env: {
    ...process.env,
    PGHOST: host,
    PGPORT: String(port),
    PGUSER: user,
    ...(password ? { PGPASSWORD: password } : {}),
  },
});

if (format !== 'custom') {
  const writeStream = fs.createWriteStream(outFile, { encoding: 'utf8' });
  child.stdout.pipe(writeStream);
  child.on('close', (code) => {
    writeStream.end();
    if (code === 0) {
      console.log('Backup completed.');
      process.exit(0);
    }
    console.error(`pg_dump exited with code ${code}`);
    process.exit(code || 1);
  });
} else {
  child.on('close', (code) => {
    if (code === 0) {
      console.log('Backup completed.');
      process.exit(0);
    }
    console.error(`pg_dump exited with code ${code}`);
    process.exit(code || 1);
  });
}

