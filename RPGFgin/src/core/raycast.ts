import { Camera } from "./camera";
import { RenderableObject } from "./RenderableObject";
import { Mesh } from "./mesh";
import {
  normalize,
  inverse,
  mul,
  vec2,
  vec3,
  vec4,
  dot,
  cross,
  sub,
  add,
  epsilon,
} from "glm-js";
import { Material } from "./material";
import { gl } from "../main";

export class Raycast {
  private rayOrigin: any;
  private rayDirection: any;

  createGeometry(arr) {
    const mesh = new Mesh(
      new Float32Array(arr),
      new Float32Array(),
      new Float32Array(),
      new Uint16Array([0, 1])
    );

    mesh.allowIntersections = false;

    return mesh;
  }

  raycast(coords: vec2, objects: RenderableObject[], camera: Camera) {
    const inverseView = inverse(camera.getViewMatrix());
    const inverseProjection = inverse(camera.getProjectionMatrix());
    const world = mul(camera.getViewMatrix(), camera.getProjectionMatrix());

    this.rayOrigin = camera.position.clone();

    this.rayDirection = new vec4(coords.x, coords.y, -1, 1);
    this.rayDirection = mul(inverseProjection, this.rayDirection);
    this.rayDirection.z = -1;
    this.rayDirection.w = 0;
    this.rayDirection = mul(inverseView, this.rayDirection);
    this.rayDirection = add(
      this.rayOrigin,
      normalize(
        new vec3(this.rayDirection.x, this.rayDirection.y, this.rayDirection.z)
      ).mul(200)
    );

    let _mesh = this.createGeometry([0, 0, 0, 0, 0, 0]);
    objects.push(
      new RenderableObject(
        [],
        new Material(objects[0].material.getShader(), gl.LINES)
      )
    );

    objects.forEach((object) => {
      object.meshes.forEach((mesh) => {
        if (!mesh.allowIntersections) {
          return;
        }

        for (let i = 0; i < mesh.vertices.length; i += 9) {
          const { vertices } = mesh;
          const a = new vec3(vertices[i + 0], vertices[i + 1], vertices[i + 2]);
          const b = new vec3(vertices[i + 3], vertices[i + 4], vertices[i + 5]);
          const c = new vec3(vertices[i + 6], vertices[i + 7], vertices[i + 8]);
          const intersection = this.rayTriangleIntersection(a, b, c);

          if (intersection) {
            console.log(intersection);
            objects[1].meshes[0] = this.createGeometry(
              intersection.intersectionPoint.array.concat(intersection.N.array)
            );
            return;
          }
        }
      });
    });
  }

  rayTriangleIntersection(v0, v1, v2) {
    const edge0 = sub(v1, v0);
    const edge1 = sub(v2, v0);
    const N = normalize(cross(edge0, edge1));
    const NdotDir = dot(this.rayDirection, N);

    if (Math.abs(NdotDir) < epsilon()) {
      console.log("EPSILON TEST!");

      return;
    }

    const t = dot(sub(v0, this.rayOrigin), N) / dot(this.rayDirection, N);

    if (t < 0) {
      return;
    }

    const intersectionPoint = add(this.rayOrigin, mul(this.rayDirection, t));

    const vp0 = sub(intersectionPoint, v0);

    if (dot(cross(edge0, vp0), N) < 0) {
      return;
    }

    const vp1 = sub(intersectionPoint, v1);

    if (dot(cross(sub(v2, v1), vp1), N) < 0) {
      return;
    }

    const vp2 = sub(intersectionPoint, v2);

    if (dot(cross(sub(v0, v2), vp2), N) < 0) {
      return;
    }

    return { intersectionPoint, N };
  }
}
