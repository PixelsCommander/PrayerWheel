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
        this.initContextProperties();
        this.createSetters();
    }

    initContextProperties() {
        const keys = Object.keys(this.props.initialValue);
        const values = Object.values(this.props.initialValue);

        keys.forEach((key, idx) => {
            const value = values[idx];
            this.props.context._currentValue['_' + key] = value;
        });
    }

    createSetters() {
        const keys = Object.keys(this.props.initialValue);

        keys.forEach((key, idx) => {
            this.createSetter(key);
        });
    }

    createSetter(key: string) {
        Object.defineProperty(this.props.context._currentValue, key, {
            get: () => this.props.context._currentValue['_' + key],
            set: (val) => {

                console.log(key);
                this.props.context._currentValue['_' + key] = val;
                this.props.context._currentValue = Object.assign({}, this.props.context._currentValue);
                this.createSetters();
                this.forceUpdate();
            }
        });
    }

    render() {
        console.log('Provider render');
        return <this.props.context.Provider value={this.props.context._currentValue}>
                {this.props.children}
            </this.props.context.Provider>;
    }
}