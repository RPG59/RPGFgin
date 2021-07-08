#version 300 es

precision highp float;

out vec4 fragColor;
in vec3 v_pos;

void main() {
  fragColor = vec4(v_pos, 1.);
}

