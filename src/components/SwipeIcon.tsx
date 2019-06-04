import * as React from 'react';
import { swipeIntroLength } from "../constants";

export class SwipeIcon extends React.Component<{}, { visible: boolean }> {

    constructor(props: {}) {
        super(props);

        this.state = {
            visible: true,
        };
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                visible: false,
            });
        }, swipeIntroLength);
    }

    render() {

        const classNames = ['SwipeIcon'];

        if (!this.state.visible) {
            classNames.push('Invisible');
        }

        return <div className="DialogOverlay">
            <img alt="Swipe pointer" className={classNames.join(' ')} src="./assets/swipe-icon.svg"/>
        </div>;
    }
}