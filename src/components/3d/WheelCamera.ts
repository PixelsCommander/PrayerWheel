import {ArcRotateCamera, Vector3, Scene} from '@babylonjs/core';
import {speedObservable} from '../../observables';
import {lerp} from '../../utils';

const minBeta = 1.85;
const maxBeta = Math.PI / 2 + 0.15;
const minSpeed = 0;
const maxSpeed = 0.07;
const cameraSpeed = 0.05;

export class WheelCamera extends ArcRotateCamera {

    private targetBeta = minBeta;

    constructor(scene: Scene) {
        super('camera', 0, minBeta, 14.5, new Vector3(0, 0.8, 0), scene);

        speedObservable.add(this.onSpeedUpdated);
        this.lerpSpeed();
    }

    onSpeedUpdated = (speed: any) => {
        this.targetBeta = interpolate(speed, minSpeed, maxSpeed, minBeta, maxBeta);
    }

    lerpSpeed = () => {
        this.beta = lerp(this.beta, this.targetBeta, cameraSpeed);
        requestAnimationFrame(this.lerpSpeed);
    }
}

function interpolate(value: number, s1: number, s2: number, t1: number, t2: number, slope?: number) {
    //Default to linear interpolation
    slope = slope || 0.5;

    //If the value is out of the source range, floor to min/max target values
    if (value < Math.min(s1, s2)) {
        return Math.min(s1, s2) === s1 ? t1 : t2;
    }

    if (value > Math.max(s1, s2)) {
        return Math.max(s1, s2) === s1 ? t1 : t2;
    }

    //Reverse the value, to make it correspond to the target range (this is a side-effect of the bezier calculation)
    value = s2 - value;

    var C1 = {x: s1, y: t1}; //Start of bezier curve
    var C3 = {x: s2, y: t2}; //End of bezier curve
    var C2 = {              //Control point
        x: C3.x,
        y: C1.y + Math.abs(slope) * (C3.y - C1.y)
    };

    //Find out how far the value is on the curve
    var percent = value / (C3.x - C1.x);

    return C1.y * b1(percent) + C2.y * b2(percent) + C3.y * b3(percent);

    function b1(t: number) {
        return t * t
    }

    function b2(t: number) {
        return 2 * t * (1 - t)
    }

    function b3(t: number) {
        return (1 - t) * (1 - t)
    }
};