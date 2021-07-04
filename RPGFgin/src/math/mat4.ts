import { vec3 } from "./vec3";

import * as glm from "glm-js";

export class mat4 {
  static lookAt(pos: vec3, at: vec3, up: vec3) {
    return glm.lookAt(
      glm.vec3(pos.x, pos.y, pos.z),
      glm.vec3(at.x, at.y, at.z),
      glm.vec3(up.x, up.y, up.z)
    );
  }

  static perspective(
    fovRad: number,
    aspect: number,
    near: number,
    far: number
  ) {
    return glm.perspective(fovRad, aspect, near, far);
  }
}
