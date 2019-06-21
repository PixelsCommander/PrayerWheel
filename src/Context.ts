import * as React from 'react';

export type ContextType = {
    speed: number,
    spins: number,
    loaded: boolean;
    everSpinned: boolean;
    setSpins?: (value: number) => void,
    setSpeed?: (value: number) => void,
    setLoaded?: (value: boolean) => void,
    setEverSpinned?: (value: boolean) => void,
};

export const Context = React.createContext({
    speed: 0,
    spins: 0,
    loaded: false,
    everSpinned: false,
});