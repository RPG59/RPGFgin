#version 300 es

precision lowp float;

struct Material {
     sampler2D texture_diffuse[5];
     sampler2D texture_normal[5];
     sampler2D texture_specular[5];
     sampler2D texture_height[5];
};

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;

    float constant;
    float linear;
    float quadratic;
};


out vec4 fragColor;

in vec3 normal;
in vec2 texCoord;
in vec3 fragPos;

uniform vec3 cameraPosition;
uniform vec3 lightSourcePosition;
uniform Material material;
uniform Light light;


void main() {
    fragColor = vec4(.3, .1, .5, 1.);
}
