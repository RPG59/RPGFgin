import { Mesh } from "../core/mesh";

// Mesh[]

export class ObjLoader {
    data: string;
    meshes: Mesh[] = [];
    objects: Object3D[] = [];
    mtllib: string[] = [];
    usemtl: string[] = [];
    vertices: number[] = [];
    texCoord: number[] = [];
    normals: number[] = [];
    indices: number[] = [];

    constructor(data: string) {
        this.data = data;
    }

    // load(): Promise<void> {

    // }

    parse(): void {
        const lines = this.data.split('\n')
        lines.push(null);
        let line = '';
        let i = 0;


        while ((line = lines[i++]) !== null) {
            line = line.trim();
            const command = this.getCommand(line);

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
        this.vertices = this.vertices.concat(line.replace('v', '').split(/\s+/).map(x => Number(x)));
    }

    parseNormals(line: string): void {

    }

    parseUsemtl(line: string): void {
        this.objects[this.objects.length - 1].usemtl = line.split(' ')[1];
    }

    parseFaces(line: string): void {
        const arr = line.replace('f ', '').split(/\s+/);
        for (let i = 0; i < arr.length; ++i) {
            const face = arr[i].split('/').map(Number);
            this.objects[this.objects.length - 1].indices.push(face[0] - 1);
        }

    }

    parseObjectName(line: string): void {
        const name = line.split(' ')[1];
        this.objects.push(new Object3D(name));
    }

    parseMtllib(line: string): void {
        this.mtllib.push(line.split(' ')[1]);
    }

}

class Object3D {
    name: string;
    indices: number[] = [];
    usemtl: string;
    constructor(name: string) {
        this.name = name;
    }
}