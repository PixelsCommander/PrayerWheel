import {AbstractMesh, Mesh, Scene, SceneLoader, Axis, Space, PointerDragBehavior, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/";
import {ContextType} from "../../Context";
import {minMantraSpeed} from "../../constants";

export class Wheel extends Mesh {
    private model?: AbstractMesh;
    private speed = 0.01;
    private friction = 0.99;
    private autoRotate = false;
    private lastMousePosition?: number;
    private context: ContextType;

    constructor(name: string, scene: Scene, context: ContextType) {
        super(name, scene);
        this.context = context;

        SceneLoader.Append("./assets/prayer-wheel/", "prayerdrum.gltf", scene, (sceneArg) => {
            this.model = this.getScene().meshes.find(mesh => {
                if (mesh.name === "baked") {
                    return true;
                }

                return false;
            });

            this.rotateWheel();
            this.initDrag();

            if (context.setLoaded) {
                context.setLoaded(true);
            }
        });
    }

    initDrag() {
        var pointerDragBehavior = new PointerDragBehavior({dragAxis: new Vector3(1, 0, 0)});
        pointerDragBehavior.moveAttached = false;
        pointerDragBehavior.useObjectOrienationForDragging = false;

        pointerDragBehavior.onDragStartObservable.add((event) => {
            console.log('Drag start');
            const pickResult = this.getScene().pick(this.getScene().pointerX, this.getScene().pointerY);

            if (pickResult && pickResult.hit && pickResult.pickedPoint) {
                this.lastMousePosition = pickResult.pickedPoint.z;
            }
        })

        pointerDragBehavior.onDragObservable.add((event) => {
            const pickResult = this.getScene().pick(this.getScene().pointerX, this.getScene().pointerY);

            if (pickResult && pickResult.hit && pickResult.pickedPoint) {

                const relativePosition = Math.min(1, pickResult.pickedPoint.z / 2.5);

                if (this.lastMousePosition !== undefined) {
                    const oldAngle = Math.acos(this.lastMousePosition);
                    const newAngle = Math.acos(relativePosition);

                    const speed = newAngle - oldAngle;
                    if (speed > 0) {
                        this.setSpeed(speed);
                    }
                }

                this.lastMousePosition = relativePosition;
            }
        })

        pointerDragBehavior.onDragEndObservable.add((event) => {
            this.lastMousePosition = undefined;
        })

        if (this.model) {
            this.model.addBehavior(pointerDragBehavior);
        }
    }

    setSpeed(pixels: number) {
        let targetSpeed = Math.max(pixels, this.speed);
        const speed = lerp(this.speed, targetSpeed, 0.1);

        this.setSpeedToContext(speed);
        this.speed = speed;
    }

    // Optimization to run tree updates only when boundry of minMantraSpeed is reached
    setSpeedToContext(newSpeed: number) {
        if (this.context.setSpeed && ((newSpeed >= minMantraSpeed && this.speed <= minMantraSpeed) ||
            (this.speed >= minMantraSpeed && newSpeed <= minMantraSpeed))) {
            this.context.setSpeed(newSpeed);
        }
    }

    rotateWheel = () => {
        if (this.model) {
            this.model.rotate(Axis.Y, -this.speed, Space.WORLD);
        }

        if (!this.autoRotate) {
            const newSpeed = this.speed * this.friction;

            this.setSpeedToContext(newSpeed);

            this.speed = newSpeed;
        }

        requestAnimationFrame(this.rotateWheel);
    }
}

function lerp(start: number, end: number, amt: number): number {
    return (1 - amt) * start + amt * end
}