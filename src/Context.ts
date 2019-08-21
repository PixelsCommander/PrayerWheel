import {createContext} from './EContext';

export type ContextType = {
    speed: number,
    spins: number,
    loaded: boolean;
    everSpinned: boolean;
    autoRotation: boolean;
};

const eContext = createContext({
    speed: 0,
    spins: 0,
    loaded: false,
    everSpinned: false,
    autoRotation: true,
});

export const Context = eContext.context;
export const Provider = eContext.provider;