import { Mesh } from "../core/mesh";

// Mesh[]

export class ObjLoader {
    meshes: Mesh[] = [];
    objects: Object3D[] = [];
    mtllib: string[] = [];
    usemtl: string[] = [];
    vertices: number[] = [];
    texCoord: number[] = [];
    normals: number[] = [];
    indices: number[] = [];
    currentObject: Object3D;

    constructor(data: string) {
        this.parse(data);
    }

    // loadMTL(): Promise<void> {
    // }

    parse(data): void {
        console.log('START PARSING .obj');

        const lines = data.split('\n')
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
        line.substr(1).trim().split(/\s+/).forEach(x => this.vertices.push(+x));

        // this.vertices = this.vertices.concat(line.replace('v', '').trim().split(/\s+/).map(x => Number(x)));
    }

    parseNormals(line: string): void {

    }

    parseUsemtl(line: string): void {
        this.currentObject.usemtl = line.split(' ')[1];
    }

    parseFaces(line: string): void {
        const arr = line.substr(1).trim().split(/\s+/);
        const len = arr.length;
        const face = [];
        for (let i = 0; i < len; ++i) {
            const item = arr[i].split('/').map(Number);
            face.push(item[0] - 1);
        }

        if (arr.length > 3) {
            const newIndexes = [];
            for (let i = 2; i < face.length; ++i) {
                newIndexes.push(face[0]);
                newIndexes.push(face[i - 1]);
                newIndexes.push(face[i]);

            }
            this.currentObject.indices = this.currentObject.indices.concat(newIndexes);
        } else {
            face.forEach(f => {
                this.currentObject.indices.push(f);
            })
            // this.currentObject.indices = this.currentObject.indices.concat(face);
        }

    }

    parseObjectName(line: string): void {
        const name = line.split(' ')[1];

        if (this.currentObject) {
            this.objects.push(this.currentObject);
        }

        this.currentObject = new Object3D(name);

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