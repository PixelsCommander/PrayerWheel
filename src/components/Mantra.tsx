import * as React from 'react';

export interface MantraState {
    visible: boolean;
    textIdx: number;
}

const opacityTransitionTime = 500;

const texts = [
    'May all beings everywhere be happy and free',
    'May all beings everywhere be free of suffering',
    'May my thoughts, words, and actions contribute in some way to happiness and freedom for all',
]

export class Mantra extends React.Component<{}, MantraState> {

    constructor(props: {}) {
        super(props);
        this.state = {
            visible: false,
            textIdx: 0,
        }

        this.triggerText = this.triggerText.bind(this);
    }

    componentDidMount() {
        setInterval(this.triggerText, 5000);
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
        const mantraClassNames = ['MantraText'];

        if (!this.state.visible) {
            mantraClassNames.push('Invisible');
        }

        return <div className="MantraOverlay">
            <div className={mantraClassNames.join(' ')}>
                {texts[this.state.textIdx]}
            </div>
        </div>;
    }
}