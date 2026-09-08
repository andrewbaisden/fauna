import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function pad(buffer: Buffer, alignment = 4): Buffer {
  const remainder = buffer.length % alignment;
  if (remainder === 0) {
    return buffer;
  }
  return Buffer.concat([buffer, Buffer.alloc(alignment - remainder, 0x20)]);
}

function createBox(
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

function mergeBoxes(boxes: ReturnType<typeof createBox>[]) {
  const positions: number[] = [];
  const indices: number[] = [];
  for (const box of boxes) {
    const base = positions.length / 3;
    positions.push(...box.positions);
    indices.push(...box.indices.map((index) => index + base));
  }
  return { positions, indices };
}

export async function generateElephantGlb(
  outputDir = path.join(process.cwd(), "public/models"),
): Promise<string> {
  const mesh = mergeBoxes([
    createBox(1.6, 1.1, 0.9, [0, 1.1, 0]),
    createBox(0.7, 0.6, 0.6, [1.05, 1.35, 0]),
    createBox(0.18, 0.7, 0.18, [1.35, 0.85, 0]),
    createBox(0.7, 0.9, 0.08, [0.1, 1.5, 0.52]),
    createBox(0.7, 0.9, 0.08, [0.1, 1.5, -0.52]),
    createBox(0.22, 0.9, 0.22, [-0.5, 0.45, 0.28]),
    createBox(0.22, 0.9, 0.22, [-0.5, 0.45, -0.28]),
    createBox(0.22, 0.9, 0.22, [0.5, 0.45, 0.28]),
    createBox(0.22, 0.9, 0.22, [0.5, 0.45, -0.28]),
  ]);

  const positionBytes = Buffer.from(new Float32Array(mesh.positions).buffer);
  const indexBytes = Buffer.from(new Uint16Array(mesh.indices).buffer);
  const alignedIndex = pad(indexBytes);
  const bin = Buffer.concat([positionBytes, alignedIndex]);

  const json = {
    asset: { version: "2.0", generator: "Fauna educational mesh" },
    scene: 0,
    scenes: [{ nodes: [0] }],
    nodes: [{ mesh: 0, name: "AfricanElephantStylized" }],
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
          baseColorFactor: [0.45, 0.45, 0.48, 1],
          metallicFactor: 0,
          roughnessFactor: 0.9,
        },
      },
    ],
    accessors: [
      {
        bufferView: 0,
        componentType: 5126,
        count: mesh.positions.length / 3,
        type: "VEC3",
        max: [1.44, 1.95, 0.56],
        min: [-0.81, 0, -0.56],
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
  const file = Buffer.concat([
    header,
    jsonHeader,
    jsonChunk,
    binHeader,
    binPadded,
  ]);
  header.writeUInt32LE(file.length, 8);
  const out = Buffer.concat([
    header,
    jsonHeader,
    jsonChunk,
    binHeader,
    binPadded,
  ]);

  await mkdir(outputDir, { recursive: true });
  const dest = path.join(outputDir, "african-elephant.glb");
  await writeFile(dest, out);
  return dest;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  generateElephantGlb()
    .then((dest) => {
      console.info(`Wrote ${dest}`);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
