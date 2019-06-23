import {AbstractMesh, Mesh, Scene, SceneLoader, Axis, Space, PBRMaterial} from "@babylonjs/core";
import "@babylonjs/loaders/";
import {ContextType} from "../../Context";

const DharmachakraModel = require("./Dharmachakra.glb");

export class Dharmachakra extends Mesh {
    private model?: AbstractMesh;
    private wheel?: AbstractMesh;
    private gem?: AbstractMesh;

    private gemMaterial?: PBRMaterial;
    private wheelMaterial?: PBRMaterial;

    private speed = 0.02;

    private context: ContextType;

    constructor(name: string, scene: Scene, context: ContextType) {
        super(name, scene);
        this.context = context;

        const lastIndexOfSlash = DharmachakraModel.lastIndexOf('/') + 1;
        const path = DharmachakraModel.substring(0, lastIndexOfSlash);
        const filename = DharmachakraModel.substring(lastIndexOfSlash, DharmachakraModel.length);

        SceneLoader.Append(path, filename, scene, (sceneArg) => {
            this.getScene().meshes.forEach(mesh => {
                switch (mesh.name) {
                    case "__root__":
                        this.model = mesh;
                        break;
                    case "baked_primitive0":
                        this.wheel = mesh;
                        break;
                    case "baked_primitive1":
                        this.gem = mesh;
                        break;
                }

                this.getScene().materials.forEach(material => {
                    switch (material.name) {
                        case "gem":
                            this.gemMaterial = material as PBRMaterial;
                            break;
                        case "dharmachakra":
                            this.wheelMaterial = material as PBRMaterial;
                            break;
                    }
                });

                const wheelMaterial = (this.wheelMaterial as PBRMaterial);
                wheelMaterial.transparencyMode = 3;
                wheelMaterial.metallic = 1;
                wheelMaterial.roughness = 0.1;
                wheelMaterial.emissiveTexture = wheelMaterial.albedoTexture;


                const gemMaterial = (this.gemMaterial as PBRMaterial);
                gemMaterial.metallic = 0;
                gemMaterial.roughness = 0;
                gemMaterial.subSurface.isRefractionEnabled = true;
                gemMaterial.subSurface.indexOfRefraction = 1.1;
                gemMaterial.subSurface.refractionIntensity = 0.1;
                gemMaterial.subSurface.isTranslucencyEnabled = true;
                gemMaterial.subSurface.translucencyIntensity = 0.5;
            });



            this.rotateWheel();
        });
    }

    rotateWheel = () => {
        if (this.model) {
            this.model.rotate(Axis.Z, this.speed, Space.WORLD);
        }

        if (!this.context.loaded) {
            requestAnimationFrame(this.rotateWheel);
        }
    }
}