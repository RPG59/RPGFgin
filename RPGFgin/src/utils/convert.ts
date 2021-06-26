import { vec2 } from "glm-js";

export function normalizeMouseCoords(clientX: number, clientY: number): vec2 {
  const mouse = new vec2();

  mouse.x = (2 * clientX) / window.innerWidth - 1;
  mouse.y = 1 - (2 * clientY) / window.innerHeight;

  return mouse;
}
