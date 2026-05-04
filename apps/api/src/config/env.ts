import "dotenv/config";

function readMongoUri(): string {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  return mongoUri;
}

function readPort(): number {
  const rawPort = process.env.PORT ?? "3001";
  const port = Number(rawPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
  }

  return port;
}

export const env = {
  mongoUri: readMongoUri(),
  port: readPort(),
};
