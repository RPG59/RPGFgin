#version 300 es

precision highp float;

out vec4 fragColor;

uniform vec3 u_startPoint;
uniform vec3 u_endPoint;

void main() {
  fragColor = vec4(u_endPoint, 1.);
}

