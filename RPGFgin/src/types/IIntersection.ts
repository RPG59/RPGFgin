import { vec3 } from "../math/vec3";

export interface IIntersection {
  intersectionPoint: vec3;
  normal: vec3;
  distance: number;
}
