import { execSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const POSTGRES_IMAGE = 'ankane/pgvector';
const POSTGRES_DB = 'test';
const POSTGRES_USER = 'test';
const POSTGRES_PASSWORD = 'test';

type StartedPostgres = {
  getConnectionUri(): string;
  getHost(): string;
  getPort(): number;
  getDatabase(): string;
  getUsername(): string;
  getPassword(): string;
};

let containerId: string | null = null;
let containerInfo: StartedPostgres | null = null;

const getHostPort = (id: string) => {
  const output = execSync(`podman port ${id} 5432/tcp`, {
    encoding: 'utf8',
  }).trim();
  const firstLine = output.split(/\r?\n/)[0] ?? '';
  const match = firstLine.match(/:(\d+)\s*$/);
  if (!match) {
    throw new Error(`Failed to parse podman port output: "${output}"`);
  }
  return Number(match[1]);
};

const waitForPostgres = async (id: string) => {
  const maxAttempts = 60;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      execSync(
        `podman exec ${id} pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}`,
        { stdio: 'ignore' },
      );
      return;
    } catch {
      await delay(1000);
    }
  }
  throw new Error('Postgres did not become ready within 60 seconds.');
};

export const startPostgres = async () => {
  if (containerInfo) return containerInfo;

  const id = execSync(
    `podman run -d -p 127.0.0.1::5432 -e POSTGRES_DB=${POSTGRES_DB} -e POSTGRES_USER=${POSTGRES_USER} -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} ${POSTGRES_IMAGE}`,
    { encoding: 'utf8' },
  ).trim();
  containerId = id;

  await waitForPostgres(id);
  const port = getHostPort(id);
  const host = '127.0.0.1';

  containerInfo = {
    getConnectionUri: () =>
      `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${host}:${port}/${POSTGRES_DB}`,
    getHost: () => host,
    getPort: () => port,
    getDatabase: () => POSTGRES_DB,
    getUsername: () => POSTGRES_USER,
    getPassword: () => POSTGRES_PASSWORD,
  };

  return containerInfo;
};

export const stopPostgres = async () => {
  if (!containerId) return;
  execSync(`podman rm -f ${containerId}`, { stdio: 'ignore' });
  containerId = null;
  containerInfo = null;
};
