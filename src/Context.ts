import * as React from 'react';

export type ContextType = {
    speed: number,
    spins: number,
    setSpins?: (value: number) => {},
    setSpeed?: (value: number) => {},
};

export const Context = React.createContext({
    speed: 0,
    spins: 0,
});