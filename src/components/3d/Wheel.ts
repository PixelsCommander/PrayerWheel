import {AbstractMesh, Mesh, Scene, SceneLoader, Axis, Space, PointerDragBehavior, Vector3} from "@babylonjs/core";
import "@babylonjs/loaders/";
import { ContextType } from "../../Context";

//const autoRotationSpeed = 0.01;

export class Wheel extends Mesh {
    private model?: AbstractMesh;
    private speed = 0.01;
    private friction = 0.99;
    private autoRotate = false;
    private lastX?: number;

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
                this.lastX = pickResult.pickedPoint.x;
            }
        })

        pointerDragBehavior.onDragObservable.add((event) => {
            const pickResult = this.getScene().pick(this.getScene().pointerX, this.getScene().pointerY);

            if (pickResult && pickResult.hit && pickResult.pickedPoint) {

                if (this.lastX) {
                    const speed = pickResult.pickedPoint.x - this.lastX;
                    if (speed > 0) {
                        this.setSpeed(speed);
                    }
                }

                this.lastX = pickResult.pickedPoint.x;
            }
        })

        pointerDragBehavior.onDragEndObservable.add((event) => {
            this.lastX = undefined;
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