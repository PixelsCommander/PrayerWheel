import {AbstractMesh, Mesh, Scene, SceneLoader, Axis, Space, PointerDragBehavior, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/";
import { ContextType } from "../../Context";

//const autoRotationSpeed = 0.01;

export class Wheel extends Mesh {
    private model?: AbstractMesh;
    private speed = 0.01;
    private friction = 0.99;
    private autoRotate = false;
    private lastMousePosition?: number;

    constructor(name: string, scene: Scene, context: ContextType) {
        super(name, scene);

        SceneLoader.Append("./assets/", "prayerwheel.glb", scene, (sceneArg) => {
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
        this.speed = Math.max(pixels, this.speed);
    }

    rotateWheel = () => {
        if (this.model) {
            this.model.rotate(Axis.Y, this.speed, Space.WORLD);
        }

        if (!this.autoRotate) {
            this.speed *= this.friction;
        }

        requestAnimationFrame(this.rotateWheel);
    }
}