import { createContext, SetStateAction } from 'react';

export interface Auth {
  userId: number;
  site: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatar: string | null;
}

interface AuthContextInterface {
  user: Auth | null;
  setUser: React.Dispatch<SetStateAction<Auth | null>>;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export default AuthContext;
