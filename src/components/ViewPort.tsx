import * as React from 'react';
import {
    Scene,
    Vector3,
    DirectionalLight,
    Engine,
    MeshBuilder,
    CubeTexture,
    Color3,
    Texture,
    PBRMaterial
} from '@babylonjs/core';

import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Context } from "../Context";

import {Wheel} from './3d/Wheel';
import {WheelCamera} from './3d/WheelCamera';

const skyboxPath = '/assets/environment-specular.env';

export class ViewPort extends React.Component {

    private canvas = React.createRef<HTMLCanvasElement>();
    private scene!: Scene;
    private engine!: Engine;
    private camera!: WheelCamera;
    private light!: DirectionalLight;
    private karmaWheel!: Wheel;

    componentDidMount() {
        this.engine = new Engine(this.canvas.current, true, undefined, true);
        this.scene = new Scene(this.engine);

        this.camera = new WheelCamera(this.scene);

        this.light = new DirectionalLight('light1', new Vector3(-5, 6, 3), this.scene);
        this.light.direction = new Vector3(-0.892, -0.405, -0.2);
        this.light.intensity = 2;
        this.light.shadowEnabled = false;

        var skybox = MeshBuilder.CreateBox("skyBox", {size: 50.0}, this.scene);
        var skyboxMaterial = new PBRMaterial("skyBox", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new CubeTexture(
            skyboxPath,
            this.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMaterial.albedoColor = new Color3(1, 1, 1);
        skyboxMaterial.reflectivityColor = new Color3(1, 1, 1);
        skyboxMaterial.microSurface = 0.7;
        skybox.material = skyboxMaterial;

        if (!this.scene.environmentTexture) {
            this.scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(skyboxPath, this.scene);
        }

        this.karmaWheel = new Wheel('wheel', this.scene, this.context);

        this.engine.runRenderLoop(() => {
            this.scene.render();
        });

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // this.scene.debugLayer.show();
    }

    render() {
        return <canvas ref={this.canvas} className="ViewPort" touch-action="none"></canvas>;
    }
}

ViewPort.contextType = Context;