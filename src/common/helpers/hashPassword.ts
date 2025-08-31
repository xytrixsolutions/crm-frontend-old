import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  // @typescript-eslint/no-unsafe-member-access
  const hashedPassword: string = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};
