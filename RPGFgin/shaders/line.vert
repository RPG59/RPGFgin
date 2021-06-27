#version 300 es

layout(location = 0) in vec4 a_positions;

uniform mat4 u_projMatrix;
uniform mat4 u_viewMatrix;

uniform vec3 u_startPoint;
uniform vec3 u_endPoint;


void main() {
  float LINE_LENGTH = .1;
  mat4 mvp = u_projMatrix * u_viewMatrix;
  vec4 start = mvp * vec4(u_startPoint, 1.);
  vec4 end = mvp * vec4(u_endPoint, 1.);
  vec2 dir = normalize(end.xy / end.w - start.xy / start.w);
  vec2 normal = vec2(-dir.y, dir.x);
  vec4 clip = a_positions.x < 0. ? start : end;

  normal *= LINE_LENGTH;

  if(a_positions.y < 0.) {
    normal *= -1.;
  }

  clip.xy += normal;

  gl_Position = clip;
}
