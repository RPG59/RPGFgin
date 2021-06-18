import { vec3 } from "glm-js";

export class MTLParser {
  materials: Material[] = [];

  constructor(data: string) {
    if (data) {
      this.parseMtlData(data);
    } else {
      throw new Error("MLT_LOADER: invalid mtl data");
    }
  }

  parseMtlData(data) {
    const lines = data.split("\n");
    const length = lines.length;

    for (let i = 0; i < length; ++i) {
      switch (lines[i].trim().split(" ")[0]) {
        case "newmtl":
          this.newmtlParse(lines[i]);
          continue;
        case "Ns":
          this.parse_Ns(lines[i]);
          continue;
        case "Ni":
          this.parse_Ni(lines[i]);
          continue;
        case "d":
          this.parse_d(lines[i]);
          continue;
        case "Tr":
          continue;
        case "Tf":
          continue;
        case "Ka":
          continue;
        case "Kd":
          continue;
        case "Ks":
          continue;
        case "Ke":
          continue;
        case "map_Ka":
          this.parse_map_Ka(lines[i]);
          continue;
        case "map_Kd":
          this.parse_map_Kd(lines[i]);
          continue;
      }
    }
  }

  newmtlParse(line): void {
    const data = line.split(/\s+/);
    if (data[1]) {
      this.materials.push(new Material(data[1]));
    } else {
      console.error("[MTL_PARSER]: Invalid material name", line);
    }
  }

  parse_Ns(line: string): void {}

  parse_Ni(line: string): void {}

  parse_d(line: string): void {}

  parse_map_Ka(line: string): void {
    this.parseElement(line, "map_Ka", "[MTL_PARSER]: Invalid material map_Ka");
  }

  parse_map_Kd(line: string): void {
    this.parseElement(line, "map_Kd", "[MTL_PARSER]: Invalid material map_Kd");
  }

  parseElement(line: string, item: string, err: string): void {
    const data = line.trim().split(/\s+/);
    if (data[1]) {
      this.getCurrentMaterial()[item] = data[1];
    } else {
      console.error(err, line);
    }
  }

  getCurrentMaterial(): Material {
    return this.materials[this.materials.length - 1];
  }
}

export class Material {
  name: string;
  Ns: number;
  Ni: number;
  d: number;
  Tr: number;
  Tf: number;
  Ka: vec3;
  Kd: vec3;
  Ks: vec3;
  Ke: vec3;
  map_Ka: string;
  map_Kd: string;

  constructor(name: string) {
    this.name = name;
  }
}
