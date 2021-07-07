#version 300 es

layout(location = 0) in vec4 a_positions;
layout(location = 1) in vec3 a_normals;
layout(location = 2) in vec2 a_uv;

out vec3 v_normals;
out vec2 v_uv;
out vec3 v_fragPos;

uniform mat4 u_projMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    gl_Position = u_projMatrix * u_viewMatrix * u_modelMatrix * a_positions;

    v_fragPos = (u_modelMatrix * vec4(a_positions.xyz, 1.0)).xyz;
    v_normals = a_normals;
    v_uv = a_uv;
}