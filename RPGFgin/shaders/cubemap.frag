#version 300 es

precision highp float;

out vec4 fragColor;

in vec3 v_uv;

uniform samplerCube u_skybox;


void main() {
  fragColor = texture(u_skybox, v_uv);
}

