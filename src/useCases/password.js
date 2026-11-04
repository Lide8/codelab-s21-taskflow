import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
const scrypt = promisify(scryptCallback);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${hash.toString('hex')}`;
}
export async function verifyPassword(password, stored) {
  const [scheme, salt, value] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !value) return false;
  const expected = Buffer.from(value, 'hex');
  const actual = await scrypt(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
