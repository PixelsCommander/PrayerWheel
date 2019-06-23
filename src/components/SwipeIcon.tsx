import * as React from 'react';
import { swipeIntroLength, swipeFadeInLength } from "../constants";

interface SwipeIconState {
    visible: boolean;
    removed: boolean;
}

export class SwipeIcon extends React.Component<{}, SwipeIconState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            visible: true,
            removed: false,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, swipeIntroLength);

        setTimeout(() => {
            this.setState({
                removed: true,
            });
        }, swipeIntroLength + swipeFadeInLength);
    }

    render() {

        const classNames = ['SwipeIcon'];

        if (!this.state.visible) {
            classNames.push('Invisible');
        }

        return !this.state.removed ? <div className="DialogOverlay">
            <img alt="Swipe pointer" className={classNames.join(' ')} src="./assets/swipe-icon.svg"/>
        </div> : null;
    }
}