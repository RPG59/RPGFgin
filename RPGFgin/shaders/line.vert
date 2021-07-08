#version 300 es

layout(location = 0) in vec4 a_positions;

uniform mat4 u_projMatrix;
uniform mat4 u_viewMatrix;

out vec3 v_pos;


void main() {
  v_pos = a_positions.xyz;
  gl_Position = u_projMatrix * u_viewMatrix * a_positions;
}
