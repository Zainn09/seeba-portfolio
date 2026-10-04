import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public/videos");
const slugs = [
  "chai-dosti-cafe",
  "responsive-calculator",
  "library-management-system",
  "student-management-system",
  "bank-management-system",
  "sneakerstore",
];

function fixFastStart(inputPath, outputPath) {
  const buf = readFileSync(inputPath);
  
  // Parse boxes
  let offset = 0;
  const boxes = [];
  while (offset < buf.length) {
    if (offset + 8 > buf.length) break;
    const size = buf.readUInt32BE(offset);
    const type = buf.slice(offset + 4, offset + 8).toString();
    if (size === 0 || size > buf.length - offset) break;
    boxes.push({ offset, size, type, data: buf.slice(offset, offset + size) });
    offset += size;
  }
  
  console.log(`\n${inputPath}: found ${boxes.length} boxes`);
  boxes.forEach(b => console.log(`  ${b.type} at ${b.offset} size ${b.size}`));
  
  // Find ftyp, moov, mdat
  const ftyp = boxes.find(b => b.type === 'ftyp');
  const moov = boxes.find(b => b.type === 'moov');
  const mdat = boxes.find(b => b.type === 'mdat');
  const freeBoxes = boxes.filter(b => b.type === 'free');
  
  if (!ftyp || !moov || !mdat) {
    console.log(`  Missing ftyp/moov/mdat, skipping`);
    return;
  }
  
  // For fast start, we need ftyp + moov + mdat
  // But we need to update stco (chunk offset) in moov to reflect new mdat position
  // stco contains offset of mdat data
  
  // Find stco box inside moov
  const moovData = moov.data;
  const stcoIndex = moovData.indexOf(Buffer.from('stco'));
  if (stcoIndex !== -1) {
    const stcoSize = moovData.readUInt32BE(stcoIndex - 4);
    console.log(`  Found stco at ${stcoIndex} in moov, size ${stcoSize}`);
    // stco structure: size(4) + type(4) + version(1) + flags(3) + entryCount(4) + entries...
    // Entry is offset of chunk
    const entryCount = moovData.readUInt32BE(stcoIndex + 8);
    console.log(`  stco entryCount ${entryCount}`);
    for (let i = 0; i < entryCount; i++) {
      const entryOffset = stcoIndex + 12 + i * 4;
      const oldOffset = moovData.readUInt32BE(entryOffset);
      console.log(`    Entry ${i}: old offset ${oldOffset}`);
      // New offset = ftyp.size + moov.size + 8 (mdat header) + (oldOffset - old mdat data start)
      // Old mdat data start = mdat.offset + 8
      const oldMdatDataStart = mdat.offset + 8;
      const newMdatDataStart = ftyp.size + moov.size + 8;
      const newOffset = newMdatDataStart + (oldOffset - oldMdatDataStart);
      console.log(`    Entry ${i}: new offset ${newOffset}`);
      moovData.writeUInt32BE(newOffset, entryOffset);
    }
  }
  
  // Create new file: ftyp + moov + mdat
  const newBuf = Buffer.concat([ftyp.data, moovData, mdat.data]);
  writeFileSync(outputPath, newBuf);
  console.log(`  Fixed: ${outputPath} (${newBuf.length} bytes) - ftyp+moov+mdat`);
}

for (const slug of slugs) {
  const inputPath = join(OUT, `${slug}.mp4`);
  const outputPath = join(OUT, `${slug}.fixed.mp4`);
  fixFastStart(inputPath, outputPath);
}

// Replace originals with fixed
import { renameSync } from "node:fs";
for (const slug of slugs) {
  const fixed = join(OUT, `${slug}.fixed.mp4`);
  const original = join(OUT, `${slug}.mp4`);
  try {
    renameSync(fixed, original);
    console.log(`Replaced ${original}`);
  } catch {}
}
