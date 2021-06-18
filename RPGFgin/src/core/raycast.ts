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
} from "glm-js";
import { Material } from "./material";
import { gl } from "../main";

export class Raycast {
  private rayOrigin: any;
  private rayDirection: any;

  raycast(coords: vec2, objects: RenderableObject[], camera: Camera) {
    const inverseView = inverse(camera.getViewMatrix());
    const inverseProjection = inverse(camera.getProjectionMatrix());

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

    // this.rayDirection = add(
    //   this.rayOrigin,
    //   mul(normalize(new vec3(direction.x, direction.y, direction.z)), 20)
    // );

    const mesh = new Mesh(
      new Float32Array([
        ...this.rayOrigin.elements,
        ...this.rayDirection.elements,
      ]),
      new Float32Array(),
      new Float32Array(),
      new Uint16Array([0, 1])
    );

    objects.push(
      new RenderableObject(
        [mesh],
        new Material(objects[0].material.getShader(), gl.LINES)
      )
    );

    // objects[0].meshes.push(mesh);

    // objects.forEach((object) => {
    //   object.meshes.forEach((mesh) => {
    //     for (let i = 0; i < mesh.vertices.length; i += 9) {
    //       const { vertices } = mesh;
    //       const a = new float3(
    //         vertices[i + 0],
    //         vertices[i + 1],
    //         vertices[i + 2]
    //       );
    //       const b = new float3(
    //         vertices[i + 3],
    //         vertices[i + 4],
    //         vertices[i + 5]
    //       );
    //       const c = new float3(
    //         vertices[i + 6],
    //         vertices[i + 7],
    //         vertices[i + 7]
    //       );
    //       const intersection = this.rayTriangleIntersection(a, b, c);

    //       if (intersection) {
    //         console.log(intersection);
    //       }
    //     }
    //   });
    // });
  }

  rayTriangleIntersection(v0, v1, v2) {
    const A = sub(v1, v0);
    const B = sub(v2, v0);
    const C = A.clone().cross(B).normalize(); // plans normal
    const DdN = this.rayDirection.clone().dot(C);

    // console.log(DdN);

    if (DdN === 0) {
      console.log("TEST!!!");
      return;
    }

    if (DdN > 0) {
      return;
    }

    const diff = this.rayOrigin.clone().sub(v0);
    const DdQxE2 = this.rayDirection.dot(diff.cross(B));

    if (DdQxE2 < 0) {
      return;
    }

    const DdE1xQ = this.rayDirection.dot(A.clone().cross(diff));

    if (DdE1xQ < 0) {
      return;
    }

    if (DdQxE2 + DdE1xQ > DdN) {
      return;
    }

    const QdN = diff.dot(C);

    if (QdN > 0) {
      return;
    }

    return this.rayDirection
      .clone()
      .multiplyScalar(QdN / DdN)
      .add(this.rayOrigin);
  }
}
