#version 300 es

precision highp float;

out vec4 fragColor;

in vec3 v_normals;
in vec2 v_uv;
in vec3 v_fragPos;

uniform vec3 u_cameraPosition;
uniform mat4 u_viewMatrix;

vec3 lightPos = vec3(-1., 1., 1.);
vec3 lightColor = vec3(1., 1., 1.);
vec3 albedo = vec3(.3, .2, .1);
float ambientStreight = .3;
float specularStrength = .5;



void main() {
    vec3 normals = normalize(v_normals);
    vec3 lightDir = normalize(lightPos - v_fragPos);
    vec3 diffuse = lightColor * max(dot(normals, lightDir), 0.);

    vec3 ambient = lightColor * ambientStreight;

    vec3 viewDir = normalize(vec3(u_viewMatrix[3].x, u_viewMatrix[3].y, u_viewMatrix[3].z) - v_fragPos);
    vec3 reflectDir = reflect(-lightDir, normals);
    float spec = pow(max(dot(viewDir, reflectDir), .0), 128.);
    vec3 specular = lightColor * spec * specularStrength;

    fragColor = vec4(albedo * (ambient + diffuse + specular), 1.);
}

