import React from 'react';
import './App.css';
import {ViewPort} from './ViewPort';
import {Mantra} from './Mantra';
import {Context, ContextType} from '../Context';


class App extends React.Component<{}, ContextType> {
    constructor(props: {}) {
        super(props);
        this.state = {
            speed: 0,
            spins: 0,
        };
    }

    setSpins(value: number) {
        this.setState(state => {
            return {
                spins: value,
                ...this.state
            };
        });
    }

    setSpeed(value: number) {
        this.setState(state => {
            return {
                speed: value,
                ...this.state
            };
        });
    }

    render() {
        return (
            <div className="App">
                <Context.Provider value={this.state}>
                    <ViewPort/>
                    <Mantra/>
                </Context.Provider>
            </div>
        );
    }
}

export default App;
