import { createContext, SetStateAction } from 'react';

interface SiteContextInterface {
  site: string;
  setSite: React.Dispatch<SetStateAction<string>>;
}

const SiteContext = createContext<SiteContextInterface | null>(null);

export default SiteContext;
