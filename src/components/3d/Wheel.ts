import {AbstractMesh, Mesh, Scene, SceneLoader, Axis, Space, PointerDragBehavior, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/";
import {ContextType} from "../../Context";
import {minMantraSpeed} from "../../constants";
import {speedObservable} from "../../observables";
import {lerp} from '../../utils';

export class Wheel extends Mesh {
    private model?: AbstractMesh;
    private fingerGrip = 0.2;
    private minimumSpeed = 0.01;
    private _speed = 0.01;
    private friction = 0.99;
    private autoRotate = false;
    private lastRelativePosition?: number;
    private context: ContextType;

    constructor(name: string, scene: Scene, context: ContextType) {
        super(name, scene);
        this.context = context;

        SceneLoader.ShowLoadingScreen = false;

        SceneLoader.Append("./assets/prayer-wheel/", "prayerdrum.gltf", scene, (sceneArg) => {
            this.model = this.getScene().meshes.find(mesh => {
                if (mesh.name === "baked") {
                    return true;
                }

                return false;
            });

            this.rotateWheel();
            this.initDrag();

            const preloader = document.getElementById("Loader");

            if (preloader !== null) {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(preloader);
                }, 1000);
            }

            setTimeout(() => context.loaded = true, 1000);
        });
    }

    initDrag() {
        var pointerDragBehavior = new PointerDragBehavior({dragAxis: new Vector3(1, 0, 0)});
        pointerDragBehavior.moveAttached = false;
        pointerDragBehavior.useObjectOrienationForDragging = true;

        pointerDragBehavior.onDragStartObservable.add((event) => {
            const pickResult = this.getScene().pick(this.getScene().pointerX, this.getScene().pointerY);

            if (pickResult && pickResult.hit && pickResult.pickedPoint) {
                this.lastRelativePosition = pickResult.pickedPoint.z;
            }
        })

        pointerDragBehavior.onDragObservable.add((event) => {
            const pickResult = this.getScene().pick(this.getScene().pointerX, this.getScene().pointerY);

            if (pickResult && pickResult.hit && pickResult.pickedPoint) {

                const relativePosition = Math.min(1, pickResult.pickedPoint.z / 2.5);

                if (this.lastRelativePosition !== undefined) {
                    const oldAngle = Math.acos(this.lastRelativePosition);
                    const newAngle = Math.acos(relativePosition);
                    const speed = newAngle - oldAngle;

                    if (speed > 0) {
                        this.setSpeed(speed);
                    }
                }

                this.lastRelativePosition = relativePosition;
            }
        })

        pointerDragBehavior.onDragEndObservable.add((event) => {
            this.lastRelativePosition = undefined;
        })

        if (this.model) {
            this.model.addBehavior(pointerDragBehavior);
        }
    }

    get speed () {
        return this._speed;
    }

    set speed(value: number) {
        this._speed = value;
        speedObservable.notifyObservers(value);
    }

    setSpeed(pixels: number) {
        let targetSpeed = Math.max(pixels, this.speed);

        let speed = lerp(this.speed, targetSpeed, this.fingerGrip);

        this.setSpeedToContext(speed);
        this.speed = speed;

        if (!this.context.everSpinned) {
            this.context.everSpinned = true;
        }
    }

    // Optimization to run tree updates only when boundry of minMantraSpeed is reached
    setSpeedToContext(newSpeed: number) {
        if (((newSpeed >= minMantraSpeed && this.speed <= minMantraSpeed) ||
            (this.speed >= minMantraSpeed && newSpeed <= minMantraSpeed))) {
            this.context.speed = newSpeed;
        }
    }

    rotateWheel = () => {
        if (this.model) {
            this.model.rotate(Axis.Y, -this.speed, Space.WORLD);
        }

        let newSpeed = this.speed * this.friction;

        if (this.context.autoRotation) {
            newSpeed = Math.max(this.minimumSpeed, newSpeed);
        }

        this.setSpeedToContext(newSpeed);
        this.speed = newSpeed;

        requestAnimationFrame(this.rotateWheel);
    }
}