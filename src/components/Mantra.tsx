import * as React from 'react';
import { opacityTransitionTime, mantrasInterval, minMantraSpeed } from '../constants';
import {Context} from "../Context";

export interface MantraState {
    visible: boolean;
    textIdx: number;
}

const texts = [
    'May all beings everywhere be happy and free',
    'May all beings everywhere be free of suffering',
    'May my thoughts, words, and actions contribute in some way to happiness and freedom for all',
]

export class Mantra extends React.Component<{}, MantraState> {

    private interval?: number;

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            textIdx: 0,
        }

        this.triggerText = this.triggerText.bind(this);
    }

    triggerText() {
        this.setState({
            visible: !this.state.visible,
        }, () => {
            if (!this.state.visible) {
                setTimeout(() => {
                    const nextTextIdx = this.state.textIdx < texts.length - 1 ? this.state.textIdx + 1 : 0;
                    this.setState({
                        textIdx: nextTextIdx,
                    });
                }, opacityTransitionTime);
            }
        });
    }

    render() {
        let quickEnough = false;

        if (this.context.speed > minMantraSpeed) {
            if (!this.interval) {
                this.interval = window.setInterval(this.triggerText, mantrasInterval);
            }
            quickEnough = true;
        } else {
            if (this.interval) {
                window.clearInterval(this.interval);
                this.interval = undefined;
            }
        }

        const mantraClassNames = ['DialogContent'];

        if (!this.state.visible || !quickEnough) {
            mantraClassNames.push('Invisible');
        }

        return <div className="DialogOverlay">
            <div className={mantraClassNames.join(' ')}>
                {texts[this.state.textIdx]}
            </div>
        </div>;
    }
}

Mantra.contextType = Context;