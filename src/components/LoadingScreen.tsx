import * as React from "react";
import {
    Engine,
    Scene, ArcRotateCamera,
    Vector3, PointLight, CubeTexture, Color4
} from "@babylonjs/core";
import {Dharmachakra} from "./3d/Dharmachakra";

const skyboxPath = '/assets/environment-specular.env';

export class LoadingScreen extends React.Component<{}, {}> {

    private canvas = React.createRef<HTMLCanvasElement>();
    private scene!: Scene;
    private engine!: Engine;
    private camera!: ArcRotateCamera;
    private light!: PointLight;
    private dharmachakra!: Dharmachakra;

    componentDidMount() {
        this.engine = new Engine(this.canvas.current, true, undefined, true);
        this.scene = new Scene(this.engine);
        this.scene.clearColor = new Color4(0, 0, 0);

        this.camera = new ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, 6.35, new Vector3(0, 0, 0.01), this.scene);

        this.light = new PointLight('light1', new Vector3(0, 0.28, 1), this.scene);
        this.light.intensity = 3;
        this.light.shadowEnabled = false;

        if (!this.scene.environmentTexture) {
            this.scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(skyboxPath, this.scene);
        }

        this.dharmachakra = new Dharmachakra('wheel', this.scene, this.context);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        this.scene.debugLayer.show();
    }

    componentWillUnmount(): void {
        this.light.dispose();
        this.camera.dispose();
        this.scene.dispose();
        this.dharmachakra.dispose();
        this.engine.dispose();
    }

    render() {
        return <canvas ref={this.canvas} className="ViewPort LoadingScreen" touch-action="none"></canvas>;
    }
}