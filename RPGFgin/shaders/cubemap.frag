#version 300 es

precision highp float;

out vec4 fragColor;

in vec3 v_uv;

uniform samplerCube mainSampler;


void main() {
  fragColor = texture(mainSampler, v_uv);
}

