#version 300 es

layout(location = 0) in vec4 a_positions;

uniform mat4 u_projMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
  gl_Position = u_projMatrix * u_viewMatrix * u_modelMatrix * a_positions;
}
