import * as bcrypt from 'bcrypt';

export function comparePasswords(plainPassword: string, hash: string) {
  return bcrypt.compareSync(plainPassword, hash);
}
