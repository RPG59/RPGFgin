struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f
}

struct Camera {
  projMatrix: mat4x4<f32>,
  viewMatrix: mat4x4<f32>
}

@binding(0) @group(0) var<uniform> camera: Camera;
// @binding(2) @group(0) var<uniform> u_modelMatrix: u32;

@vertex
fn vtx_main(
    @builtin(vertex_index) vertex_index: u32,
    @location(0) position: vec4f
    // @location(1) normals: vec3f,
    // @location(2) texCoords: vec2f
  ) -> VertexOut {
  var output: VertexOut;
  const pos = array(
    vec2( 0.0,  0.5),
    vec2(-0.5, -0.5),
    vec2( 0.5, -0.5)
  );

  // output.position = vec4f(pos[vertex_index], 0, 1);
  output.color = vec4f(.5, 0, 0, 0);
  output.position = vec4f(position.xyz, 1);
  // output.position = position;


  return output;
}

@fragment
fn frag_main(fragData: VertexOut) -> @location(0) vec4f {
  return vec4(fragData.color.x, fragData.color.y, 0, 1);
}