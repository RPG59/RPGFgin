#version 300 es

precision highp float;

out vec4 fragColor;

in vec3 v_normals;
in vec2 v_uv;
in vec3 v_fragPos;

vec3 lightPos = vec3(-1., 1., 1.);
vec3 lightColor = vec3(1., 1., 1.);
float ambientStreight = .3;
float specularStrength = .3;
uniform sampler2D mainSampler;



void main() {
    vec3 albedo = texture(mainSampler, v_uv).xyz; 
    vec3 normals = normalize(v_normals);
    vec3 lightDir = normalize(lightPos - v_fragPos);
    vec3 diffuse = lightColor * max(dot(normals, lightDir), 0.);

    vec3 ambient = lightColor * ambientStreight;

    fragColor = vec4(albedo * (ambient + diffuse), 1.);
}

