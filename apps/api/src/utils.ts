import { sign, verify } from "jsonwebtoken";

export const verifyToken = ({ token }: {token: string}): string | null => {
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as { userId: string , iat: number }

    return decoded.userId
  } catch (error) {
    console.log(error);
    return null
  }
}

export const generateToken = ({ userId }: { userId: string }): string | null => {
  try {
    const token = sign({ userId }, process.env.JWT_SECRET!);
    return token;
  } catch(e) {
    console.log(e)
    return null;
  }
}