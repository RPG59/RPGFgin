import { Camera } from "./camera";
import { RenderableObject } from "./RenderableObject";
import { inverse, mul, vec2, vec4, epsilon } from "glm-js";
import { vec3 } from "../math/vec3";
import { IIntersection } from "../types/IIntersection";

export class Raycast {
  private rayOrigin: any;
  private rayDirection: any;

  raycast(coords: vec2, objects: RenderableObject[], camera: Camera) {
    this.rayOrigin = camera.position.clone();

    this.rayDirection = new vec4(coords.x, coords.y, -1, 1);
    this.rayDirection = mul(
      inverse(camera.getProjectionMatrix()),
      this.rayDirection
    );
    this.rayDirection.z = -1;
    this.rayDirection.w = 0;
    this.rayDirection = mul(inverse(camera.getViewMatrix()), this.rayDirection);
    this.rayDirection = vec3.normalize(
      new vec3(this.rayDirection.x, this.rayDirection.y, this.rayDirection.z)
    );

    return this.calculateIntersections(objects);
  }

  calculateIntersections(objects: RenderableObject[]): IIntersection[] {
    const intersections = [];
    let rIndex = 0;
    let meshIndex = 0;

    for (; rIndex < objects.length; ++rIndex) {
      for (; meshIndex < objects[rIndex].meshes.length; ++meshIndex) {
        const mesh = objects[rIndex].meshes[meshIndex];

        for (let i = 0; i < mesh.vertices.length; i += 9) {
          const { vertices } = mesh;
          const a = new vec3(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
          const b = new vec3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
          const c = new vec3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);
          const intersection = this.rayTriangleIntersection(a, b, c);

          if (intersection) {
            intersections.push(intersection);
          }
        }
      }
    }

    return intersections;
  }

  rayTriangleIntersection(v0, v1, v2): IIntersection {
    const edge0 = vec3.sub(v1, v0);
    const edge1 = vec3.sub(v2, v0);
    const N = vec3.normalize(vec3.cross(edge0, edge1));
    const NdotDir = vec3.dot(this.rayDirection, N);

    if (Math.abs(NdotDir) < epsilon()) {
      return;
    }

    const t =
      vec3.dot(vec3.sub(v0, this.rayOrigin), N) /
      vec3.dot(this.rayDirection, N);

    if (t < 0) {
      return;
    }

    const intersectionPoint = vec3.add(
      this.rayOrigin,
      vec3.mulScalar(this.rayDirection, t)
    );

    const vp0 = vec3.sub(intersectionPoint, v0);

    if (vec3.dot(vec3.cross(edge0, vp0), N) < 0) {
      return;
    }

    const vp1 = vec3.sub(intersectionPoint, v1);

    if (vec3.dot(vec3.cross(vec3.sub(v2, v1), vp1), N) < 0) {
      return;
    }

    const vp2 = vec3.sub(intersectionPoint, v2);

    if (vec3.dot(vec3.cross(vec3.sub(v0, v2), vp2), N) < 0) {
      return;
    }

    return { intersectionPoint, normal: N, distance: t };
  }
}
