import * as React from 'react';
import {Context} from "../Context";
import {LoadingScreen} from "./LoadingScreen";
import {Mantra} from "./Mantra";
import {SwipeIcon} from "./SwipeIcon";

export class UserInterface extends React.Component<{}, {}> {
    render() {
        const preloader = !this.context.loaded ? <LoadingScreen/> : undefined;

        const loadedContent = <div>
            <Mantra/>
            <SwipeIcon/>
        </div>;

        console.log('UI render');

        return <React.Fragment>
            {this.context.loaded && loadedContent}
            {preloader}
        </React.Fragment>
    }
}

UserInterface.contextType = Context;