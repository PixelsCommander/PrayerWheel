import React from 'react';
import {ViewPort} from './ViewPort';
import {Context, Provider} from '../Context';
import {UserInterface} from './UserInterface';

class App extends React.Component<{}, {}> {
    render() {
        return (<div className="App">
            <Provider>
                <ViewPort/>
                <UserInterface/>
            </Provider>
        </div>);
    }
}

App.contextType = Context;

export default App;
