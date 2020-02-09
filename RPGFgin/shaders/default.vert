#version 300 es

layout(location = 0) in vec4 Position;
layout(location = 1) in vec3 Normals;
layout(location = 2) in vec2 TexCoords;

out vec3 normals;
out vec2 texCoords;
out vec3 fragPos;

uniform mat4 u_projMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_modelMatrix;

void main() {
    gl_Position = u_projMatrix * u_viewMatrix * u_modelMatrix * Position;

    fragPos = (u_modelMatrix * vec4(Position.xyz, 1.0)).xyz;
    normals = Normals;
    texCoords = TexCoords;
}