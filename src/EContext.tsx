import * as React from "react";

interface eContext<T> {
    context: React.Context<T>;
    provider: (children: any) => React.ReactElement;
}

export function createContext<T>(defaultValue: T): eContext<T> {
    const context = React.createContext(defaultValue);

    return {
        context: context,
        provider: (props: any) => <Provider initialValue={defaultValue} context={context} children={props.children}/>,
    };
}

export class Provider extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = this.props.initialValue;
    }

    componentDidMount(): void {
        this.context = this.props.context;
        this.createSetters();
    }

    initContextProperties() {
        const keys = Object.keys(this.props.initialValue);
        const values = keys.map(key => this.props.initialValue[key]);

        keys.forEach((key, idx) => {
            const value = values[idx];
            this.props.context._currentValue['_' + key] = value;
        });
    }

    createSetters() {
        const keys = Object.keys(this.props.initialValue);
        const values = Object.values(this.props.initialValue)

        keys.forEach((key, idx) => {
            this.createSetter(key, values[idx]);
        });
    }

    createSetter(key: string, defaultValue: any) {
        this.props.context._currentValue['_' + key] = defaultValue;

        Object.defineProperty(this.props.context._currentValue, key, {
            get: () => this.props.context._currentValue['_' + key],
            set: (val) => {
                this.props.context._currentValue['_' + key] = val;
                let stateChange: {[key: string]: any} = {};
                stateChange[key] = val;

                this.setState(stateChange);

                //this.state = Object.assign(this.state, stateChange);
            }
        });
    }

    render() {
        //console.log('Provider render');
        return <this.props.context.Provider value={this.state}>
                {this.props.children}
            </this.props.context.Provider>;
    }
}