import { Mesh, TEXTURE_TYPES } from "../core/mesh";
import { FileLoader } from './fileLoader';
import { Material, MTLParser } from './mtlParser';
import { Texture } from '../core/texture';

export class ObjLoader {
    objects: Object3D[] = [];
    mtllib: string[] = [];
    usemtl: string[] = [];
    vertices: { x: number, y: number, z: number }[] = [];
    texCoord: { x: number, y: number }[] = [];
    normals: { x: number, y: number, z: number }[] = [];
    indices: number[] = [];
    mtlData: Material[] = [];

    constructor(data: string) {
        this.parse(data);
    }

    parse(data): void {
        console.log('START PARSING .obj');

        const lines = data.split('\n');
        lines.push(null);
        let line = '';
        let i = 0;

        while ((line = lines[i++]) !== null) {
            line = line.trim();
            const command = this.getCommand(line);
            if (!(i % 1000)) {
                console.log(i + ' / ', lines.length);
            }

            switch (command) {
                case '#':
                    continue;
                case 'mtllib':
                    this.parseMtllib(line);
                    continue;
                case 'o':
                case 'g':
                    this.parseObjectName(line);
                    continue;
                case 'v':
                    this.parseVetices(line);
                    continue;
                case 'vt':
                    this.parseTextureCoords(line);
                    continue;
                case 'vn':
                    this.parseNormals(line);
                    continue;
                case 'usemtl':
                    this.parseUsemtl(line);
                    continue;
                case 'f':
                    this.parseFaces(line);
                    continue;
                default:
                    continue;
            }

        }
    }

    getCommand(line: string): string | null {
        const words = line.split(' ');
        return words.length > 1 ? words[0] : null;
    }

    parseVetices(line: string): void {
        const data = line.substr(1).trim().split(/\s+/);
        const v = {
            x: +data[0],
            y: +data[1],
            z: +data[2]
        }
        this.vertices.push(v);
    }

    parseNormals(line: string): void {
        const data = line.substr(2).trim().split(/\s+/);
        const vn = {
            x: +data[0],
            y: +data[1],
            z: +data[2]
        };
        this.normals.push(vn);
    }

    parseUsemtl(line: string): void {
        this.getCurrentObject().usemtl = line.split(' ')[1];
    }

    parseFaces(line: string): void {
        const arr = line.substr(1).trim().split(/\s+/);
        const len = arr.length;
        const face = [];
        const tex = [];
        const normal = [];

        for (let i = 0; i < len; ++i) {
            const item = arr[i].split('/');

            face.push(Number(item[0]) - 1);

            if (item[1]) {
                tex.push(Number(item[1]) - 1);
            }

            if(item[2]) {
                normal.push(Number(item[2]) - 1);
            }
        }

        if (arr.length > 3) {
            const newIndexes = [];
            const newTex = [];
            const newNormal = [];

            for (let i = 2; i < face.length; ++i) {
                newIndexes.push(face[0]);
                newIndexes.push(face[i - 1]);
                newIndexes.push(face[i]);

                newTex.push(tex[0]);
                newTex.push(tex[i - 1]);
                newTex.push(tex[i]);

                newNormal.push(normal[0]);
                newNormal.push(normal[i - 1]);
                newNormal.push(normal[i]);
            }
            this.getCurrentObject().indices = this.getCurrentObject().indices.concat(newIndexes);
            this.getCurrentObject().texIndeces = this.getCurrentObject().texIndeces.concat(newTex);
            this.getCurrentObject().normalIndices = this.getCurrentObject().normalIndices.concat(newNormal);
        } else {
            face.forEach(f => {
                this.getCurrentObject().indices.push(f);
            });

            tex.forEach(t => {
                this.getCurrentObject().texIndeces.push(t);
            });

            normal.forEach(n => {
                this.getCurrentObject().normalIndices.push(n);
            });
        }
    }

    parseObjectName(line: string): void {
        const name = line.split(' ')[1];
        this.objects.push(new Object3D(name));
    }

    parseMtllib(line: string): void {
        this.mtllib.push(line.split(' ')[1]);
    }

    parseTextureCoords(line: string): void {
        const data = line.substr(2).trim().split(/\s+/);
        const vt = {
            x: +data[0],
            y: +data[1]
        };
        this.texCoord.push(vt);
    }

    getCurrentObject(): Object3D {
        return this.objects[this.objects.length - 1];
    }

    load(): Promise<void> {
        return new Promise(res => {
            const files = this.mtllib.map(mtlPath => new FileLoader(mtlPath, 'text').load());
            Promise.all(files).then(mtlFilesData => {
                this.mtlData = mtlFilesData.reduce((r, x) => r.concat(new MTLParser(x).materials), []);
                res();
            });
        });
    }

    getMeshes(): Promise<Mesh[]> {
        const meshes = [];
        const promises = [];
        this.objects.forEach(object => {
            const v = [];
            const vt = [];
            const vn = [];
            const mtl = this.mtlData.find(x => x.name === object.usemtl);
            const textures = [];
            const indices = Array.from(Array(object.indices.length).keys());

            if (mtl && mtl.map_Ka) {
                const texture = new Texture(mtl.map_Ka, TEXTURE_TYPES.DIFFUSE);
                promises.push(texture.create());
                textures.push(texture);
            }

            object.indices.forEach(x => {
                v.push(this.vertices[x].x);
                v.push(this.vertices[x].y);
                v.push(this.vertices[x].z);
            });

            object.texIndeces.forEach(x => {
                if (!x) return;
                vt.push(this.texCoord[x].x);
                vt.push(this.texCoord[x].y);
            });

            object.normalIndices.forEach(x => {
                vn.push(this.normals[x].x);
                vn.push(this.normals[x].y);
                vn.push(this.normals[x].z);

            });

            meshes.push(new Mesh(
                new Float32Array(v),
                new Float32Array(vt),
                new Float32Array(vn),
                new Uint16Array(indices),
                textures
            ));
        });


        return new Promise(res => {
            Promise.all(promises).then(() => res(meshes));
        });
    }
}

class Object3D {
    name: string;
    indices: number[] = [];
    usemtl: string;
    texIndeces: number[] = [];
    normalIndices: number[] = [];

    constructor(name: string) {
        this.name = name;
    }
}
