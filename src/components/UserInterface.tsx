import * as React from 'react';
import {Context, ContextType} from "../Context";
import {LoadingScreen} from "./LoadingScreen";
import {Mantra} from "./Mantra";
import {SwipeIcon} from "./SwipeIcon";

interface UserInterfaceState {
    preloaderVisible: boolean;
}

export class UserInterface extends React.Component<{}, UserInterfaceState> {

    private fadeInTimeout?: number;

    constructor(props: any) {
        super(props);

        this.state = {
            preloaderVisible: true,
        };
    }

    componentWillUpdate(nextProps: Readonly<{}>, nextState: Readonly<UserInterfaceState>, nextContext: ContextType): void {
        if (nextContext.loaded && this.state.preloaderVisible && !this.fadeInTimeout) {
            this.fadeInTimeout = window.setTimeout(() => {
                this.setState({
                    preloaderVisible: false,
                });
            }, 1000);
        }
    }

    render() {
        const preloader = this.state.preloaderVisible ? <LoadingScreen invisible={this.context.loaded}/> : undefined;

        const loadedContent = <React.Fragment>
            <Mantra/>
            <SwipeIcon/>
        </React.Fragment>;

        return <React.Fragment>
            {this.context.loaded && loadedContent}
            {preloader}
        </React.Fragment>
    }
}

UserInterface.contextType = Context;