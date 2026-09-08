import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export function createBox(
  width: number,
  height: number,
  depth: number,
  offset: [number, number, number],
) {
  const [ox, oy, oz] = offset;
  const x = width / 2;
  const y = height / 2;
  const z = depth / 2;
  const positions = [
    [-x, -y, -z],
    [x, -y, -z],
    [x, y, -z],
    [-x, y, -z],
    [-x, -y, z],
    [x, -y, z],
    [x, y, z],
    [-x, y, z],
  ].flatMap((point) => [point[0] + ox, point[1] + oy, point[2] + oz]);
  const indices = [
    0, 1, 2, 0, 2, 3, 4, 6, 5, 4, 7, 6, 0, 4, 5, 0, 5, 1, 2, 6, 7, 2, 7, 3, 0,
    3, 7, 0, 7, 4, 1, 5, 6, 1, 6, 2,
  ];
  return { positions, indices };
}

export function mergeBoxes(boxes: ReturnType<typeof createBox>[]) {
  const positions: number[] = [];
  const indices: number[] = [];
  for (const box of boxes) {
    const base = positions.length / 3;
    positions.push(...box.positions);
    indices.push(...box.indices.map((index) => index + base));
  }
  return { positions, indices };
}

function pad(buffer: Buffer, alignment = 4): Buffer {
  const remainder = buffer.length % alignment;
  if (remainder === 0) {
    return buffer;
  }
  return Buffer.concat([buffer, Buffer.alloc(alignment - remainder, 0x20)]);
}

export async function writeBoxMeshGlb(options: {
  outputPath: string;
  name: string;
  boxes: ReturnType<typeof createBox>[];
  color: [number, number, number];
}): Promise<{ path: string; byteLength: number }> {
  const mesh = mergeBoxes(options.boxes);
  const positionBytes = Buffer.from(new Float32Array(mesh.positions).buffer);
  const indexBytes = Buffer.from(new Uint16Array(mesh.indices).buffer);
  const alignedIndex = pad(indexBytes);
  const bin = Buffer.concat([positionBytes, alignedIndex]);

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let minZ = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < mesh.positions.length; i += 3) {
    const x = mesh.positions[i] ?? 0;
    const y = mesh.positions[i + 1] ?? 0;
    const z = mesh.positions[i + 2] ?? 0;
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    minZ = Math.min(minZ, z);
    maxX = Math.max(maxX, x);
    maxY = Math.max(maxY, y);
    maxZ = Math.max(maxZ, z);
  }

  const json = {
    asset: { version: "2.0", generator: "Fauna educational mesh" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: options.name }],
    meshes: [
      {
        primitives: [
          {
            attributes: { POSITION: 0 },
            indices: 1,
            material: 0,
          },
        ],
      },
    ],
    materials: [
      {
        pbrMetallicRoughness: {
          baseColorFactor: [...options.color, 1],
          metallicFactor: 0,
          roughnessFactor: 0.85,
        },
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: mesh.positions.length / 3,
        type: "VEC3",
        max: [maxX, maxY, maxZ],
        min: [minX, minY, minZ],
      },
      {
        bufferView: 1,
        componentType: 5123,
        count: mesh.indices.length,
        type: "SCALAR",
      },
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: 0,
        byteLength: positionBytes.length,
        target: 34962,
      },
      {
        buffer: 0,
        byteOffset: positionBytes.length,
        byteLength: indexBytes.length,
        target: 34963,
      },
    ],
    buffers: [{ byteLength: bin.length }],
  };

  const jsonChunk = pad(Buffer.from(JSON.stringify(json)));
  const jsonHeader = Buffer.alloc(8);
  jsonHeader.writeUInt32LE(jsonChunk.length, 0);
  jsonHeader.writeUInt32LE(0x4e4f534a, 4);

  const binPadded = pad(bin, 4);
  const binHeader = Buffer.alloc(8);
  binHeader.writeUInt32LE(binPadded.length, 0);
  binHeader.writeUInt32LE(0x004e4942, 4);

  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  const body = Buffer.concat([
    header,
    jsonHeader,
    jsonChunk,
    binHeader,
    binPadded,
  ]);
  body.writeUInt32LE(body.length, 8);

  await mkdir(path.dirname(options.outputPath), { recursive: true });
  await writeFile(options.outputPath, body);
  return { path: options.outputPath, byteLength: body.length };
}
