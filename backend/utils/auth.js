import bcrypt from 'bcryptjs';


export async function isValidPassword(password, storedPassword) {
  return await bcrypt.compare(password, storedPassword);
}