import {Mesh} from "../core/mesh";

// Mesh[]

export class ObjLoader {
    meshes: Mesh[] = [];
    objectNames: string[] = [];
    mtllib: string[] = [];
    usemtl: string[] = [];
    vertices: Float32Array[] = [];
    texCoord: Float32Array[] = [];
    normals: Float32Array[] = [];
    indices: Uint32Array[] = [];

    constructor(data: string) {

    }

    load(): Promise<void> {

    }

    parse(data): void {
        const lines = data.split('\n').push(null);
        let line = '';
        let i = 0;

        while((line = lines[i++].trim()) !== null) {
            const command = this.getCommand(line);

            switch(command) {
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

    }

    parseNormals(line: string): void {

    }

    parseUsemtl(line: string): void {
        this.usemtl.push(line.split(' ')[1]);
    }
    
    parseFaces(line: string): void {

    }
    
    parseObjectName(line: string): void {
        this.objectNames.push(line.split(' ')[1]);
    }
    
    parseMtllib(line: string): void {
        this.mtllib.push(line.split(' ')[1]);
    }

}
