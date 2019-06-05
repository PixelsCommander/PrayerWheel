import React from 'react';
import {ViewPort} from './ViewPort';
import {Mantra} from './Mantra';
import {Context, ContextType} from '../Context';
import {SwipeIcon} from "./SwipeIcon";

class App extends React.Component<{}, ContextType> {
    constructor(props: {}) {
        super(props);
        this.state = {
            speed: 0,
            spins: 0,
            loaded: false,
            setSpins: this.setSpins.bind(this),
            setSpeed: this.setSpeed.bind(this),
            setLoaded: this.setLoaded.bind(this),
        };
    }

    setSpins(value: number) {
        this.setState({
            spins: value,
        });
    }

    setSpeed(value: number) {
        this.setState({
            speed: value,
        });
    }

    setLoaded(value: boolean) {
        this.setState({
            loaded: value,
        });
    }

    render() {
        return (<div className="App">
            <Context.Provider value={this.state}>
                <ViewPort/>
                {this.state.loaded && <Mantra/>}
                {this.state.loaded && <SwipeIcon/>}
            </Context.Provider>
        </div>);
    }
}

export default App;
