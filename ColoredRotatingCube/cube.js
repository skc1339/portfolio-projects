// Get WebGL context from the canvas element
const canvas = document.getElementById("webglCanvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  alert("Your browser does not support WebGL.");
  throw new Error("WebGL not supported");
}

// Resize canvas to match display size
function resizeCanvasToDisplaySize() {
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
  }
}

// Vertex Shader – Positions vertices and applies transformations
const vertexShaderSource = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_Color;

  uniform mat4 u_ModelMatrix; // Model matrix for transformations

  void main() {
    gl_Position = u_ModelMatrix * a_Position; // Apply transformation to position
    v_Color = a_Color; // Pass color to fragment shader
  }
`;

// Fragment Shader – Defines colors for each face of the cube
const fragmentShaderSource = `
  precision mediump float;
  varying vec4 v_Color;

  void main() {
    gl_FragColor = v_Color; // Set the color for each pixel
  }
`;

// Compile and link shaders
function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
const program = createProgram(gl, vertexShader, fragmentShader);

gl.useProgram(program);

// Define vertices for a cube (six faces, each with four vertices)
const vertices = new Float32Array([
  // Front face
  -0.5, -0.5,  0.5,
   0.5, -0.5,  0.5,
   0.5,  0.5,  0.5,
  -0.5,  0.5,  0.5,

  // Back face
  -0.5, -0.5, -0.5,
  -0.5,  0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5, -0.5, -0.5,

  // Top face
  -0.5,  0.5, -0.5,
  -0.5,  0.5,  0.5,
   0.5,  0.5,  0.5,
   0.5,  0.5, -0.5,

  // Bottom face
  -0.5, -0.5, -0.5,
   0.5, -0.5, -0.5,
   0.5, -0.5,  0.5,
  -0.5, -0.5,  0.5,

  // Right face
   0.5, -0.5, -0.5,
   0.5,  0.5, -0.5,
   0.5,  0.5,  0.5,
   0.5, -0.5,  0.5,

  // Left face
  -0.5, -0.5, -0.5,
  -0.5, -0.5,  0.5,
  -0.5,  0.5,  0.5,
  -0.5,  0.5, -0.5,
]);

// Define colors for each vertex of the cube (each face has a unique color)
const colors = new Float32Array([
  // Front face (red)
  1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,   1.0, 0.0, 0.0, 1.0,
  // Back face (green)
  0.0, 1.0, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,   0.0, 1.0, 0.0, 1.0,
  // Top face (blue)
  0.0, 0.0, 1.0, 1.0,   0.0, 0.0, 1.0, 1.0,   0.0, 0.0, 1.0, 1.0,   0.0, 0.0, 1.0, 1.0,
  // Bottom face (yellow)
  1.0, 1.0, 0.0, 1.0,   1.0, 1.0, 0.0, 1.0,   1.0, 1.0, 0.0, 1.0,   1.0, 1.0, 0.0, 1.0,
  // Right face (magenta)
  1.0, 0.0, 1.0, 1.0,   1.0, 0.0, 1.0, 1.0,   1.0, 0.0, 1.0, 1.0,   1.0, 0.0, 1.0, 1.0,
  // Left face (cyan)
  0.0, 1.0, 1.0, 1.0,   0.0, 1.0, 1.0, 1.0,   0.0, 1.0, 1.0, 1.0,   0.0, 1.0, 1.0, 1.0,
]);

// Create and bind the vertex buffer
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
const aPosition = gl.getAttribLocation(program, "a_Position");
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aPosition);

// Create and bind the color buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
const aColor = gl.getAttribLocation(program, "a_Color");
gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(aColor);

// Set up model matrix for rotation
let angleX = 0;
let angleY = 0;
const uModelMatrix = gl.getUniformLocation(program, "u_ModelMatrix");
const modelMatrix = mat4.create();

// Enable depth testing so faces render correctly
gl.enable(gl.DEPTH_TEST);

// Function to render and animate the cube
function drawScene() {
  resizeCanvasToDisplaySize();

  // Clear the canvas with a black background
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Update the rotation angles
  mat4.identity(modelMatrix);
  mat4.rotateX(modelMatrix, modelMatrix, angleX);
  mat4.rotateY(modelMatrix, modelMatrix, angleY);
  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

  // Draw each face of the cube (6 faces × 4 vertices each)
  for (let i = 0; i < vertices.length / 3; i += 4) {
    gl.drawArrays(gl.TRIANGLE_FAN, i, 4);
  }

  // Increment angles for the next frame
  angleX += 0.01;
  angleY += 0.01;

  requestAnimationFrame(drawScene);
}

// Start animation
drawScene();
