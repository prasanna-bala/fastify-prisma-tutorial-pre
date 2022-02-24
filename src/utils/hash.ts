import crypto from "crypto";

// https://www.loginradius.com/blog/async/password-hashing-with-nodejs/

export function hashPassword(password: string) {
  // Creating a unique salt for a particular user
  const salt = crypto.randomBytes(16).toString("hex");

  // Hashing user's salt and password with 1000 iterations,
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return { hash, salt };
}

export function verifyPassword({
  password,
  salt,
  hash,
}: {
  password: string;
  salt: string;
  hash: string;
}) {
  const candidateHash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, `sha512`)
    .toString(`hex`);

  return candidateHash === hash;
}
