struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec4f
}

struct Camera {
  projMatrix: mat4x4<f32>,
  viewMatrix: mat4x4<f32>
}

@binding(0) @group(0) var<uniform> camera: Camera;
@binding(1) @group(0) var default_sampler: sampler;
@binding(0) @group(1) var default_texture: texture_2d<f32>;

@vertex
fn vtx_main(
    @builtin(vertex_index) vertex_index: u32,
    @location(0) position: vec4f,
    @location(1) texCoords: vec2f
  ) -> VertexOut {
  var output: VertexOut;

  output.color = vec4f(texCoords, 0, 0);
  // output.color = vec4f(position.z, texCoords.x, texCoords.y, 0);
  output.position = camera.projMatrix * camera.viewMatrix * position;


  return output;
}


@fragment
fn frag_main(fragData: VertexOut) -> @location(0) vec4f {
  return textureSample(default_texture, default_sampler, fragData.color.xy);
}
