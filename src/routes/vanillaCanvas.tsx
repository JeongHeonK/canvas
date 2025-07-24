import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/vanillaCanvas")({
  component: DragDropMask,
});

function DragDropMask() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvas = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const textureRef = useRef<WebGLTexture | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext("webgl2")!;
    glRef.current = gl;

    const vsSrc = `#version 300 es
      in vec2 a_position;
      in vec2 a_texCoord;
      uniform float u_scale;

      out vec2 v_texCoord;

      void main() {
        v_texCoord = a_texCoord;
        gl_Position = vec4(a_position * u_scale, 0, 1);
    }`;

    const fsSrc = `#version 300 es
    precision mediump float;
    uniform sampler2D u_mask;
    in vec2 v_texCoord;
    out vec4 outColor;

    void main() {
      float m = texture(u_mask, v_texCoord).r;
      outColor = vec4(vec3(m), 1.0);
    }`;

    const compile = (type: number, src: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // full screen quad
    const positions = new Float32Array([
      -1, -1, 0, 0, 1, -1, 1, 0, -1, 1, 0, 1, -1, 1, 0, 1, 1, -1, 1, 0, 1, 1, 1,
      1,
    ]);
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, "a_position");
    const aUV = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 16, 0);
    gl.enableVertexAttribArray(aUV);
    gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 16, 8);

    const uMaskLoc = gl.getUniformLocation(program, "u_mask");

    // create draw canvas
    const draw = document.createElement("canvas");
    draw.width = 512;
    draw.height = 512;
    drawCanvas.current = draw;
    const ctx = draw.getContext("2d")!;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 512, 512);

    // WebGL texture
    const tex = gl.createTexture()!;
    textureRef.current = tex;
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.LUMINANCE,
      gl.LUMINANCE,
      gl.UNSIGNED_BYTE,
      draw
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(uMaskLoc, 0);

    const render = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.texSubImage2D(
        gl.TEXTURE_2D,
        0,
        0,
        0,
        gl.LUMINANCE,
        gl.UNSIGNED_BYTE,
        draw
      );
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    render();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 512;
      const y = ((e.clientY - rect.top) / rect.height) * 512;

      const ctx = draw.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.bezierCurveTo(x + 10, y - 10, x + 10, y + 10, x, y + 15);
      ctx.bezierCurveTo(x - 10, y + 10, x - 10, y - 10, x, y - 10);
      ctx.fill();

      render();
    };
    let scale = 1;
    canvas.addEventListener("mousemove", handleClick);
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault(); // 스크롤 막기

      const zoomSpeed = 0.001; // 줌 감도
      const delta = e.deltaY * zoomSpeed;

      scale *= 1 - delta; // 확대 or 축소
      scale = Math.max(0.1, Math.min(scale, 10)); // 최소/최대 배율 제한

      render(); // 다시 렌더링
    });

    return () => canvas.removeEventListener("mousemove", handleClick);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
    />
  );
}
