/**
 * Batch convert PNG/JPG images in public/textures/ to WebP.
 * Excludes 3D texture maps (used by Three.js TextureLoader).
 * Updates all references in src/ data files and components.
 */
import sharp from 'sharp';
import { readdir, unlink, readFile, writeFile } from 'fs/promises';
import { join, extname, basename } from 'path';

const TEXTURES_DIR = 'public/textures';
const QUALITY = 80;

// 3D texture files that must stay as JPG (Three.js TextureLoader)
const EXCLUDE_PATTERNS = [
  'wood_oak_',
  'Wood013_',
  'Wood014_',
  'Wood018_',
];

function isExcluded(filename) {
  return EXCLUDE_PATTERNS.some(p => filename.startsWith(p));
}

async function convertImages() {
  const files = await readdir(TEXTURES_DIR);
  const convertible = files.filter(f => {
    const ext = extname(f).toLowerCase();
    return (ext === '.png' || ext === '.jpg' || ext === '.jpeg') && !isExcluded(f);
  });

  console.log(`Found ${convertible.length} images to convert (excluding ${files.length - convertible.length} 3D textures/other files)`);

  const renames = []; // { old: 'file.png', new: 'file.webp' }

  for (const file of convertible) {
    const inputPath = join(TEXTURES_DIR, file);
    const newName = basename(file, extname(file)) + '.webp';
    const outputPath = join(TEXTURES_DIR, newName);

    try {
      const info = await sharp(inputPath)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const origStat = (await import('fs')).statSync(inputPath);
      const savings = ((1 - info.size / origStat.size) * 100).toFixed(1);
      console.log(`  ${file} → ${newName} (${(origStat.size/1024).toFixed(0)}KB → ${(info.size/1024).toFixed(0)}KB, -${savings}%)`);

      renames.push({ old: file, new: newName });
      await unlink(inputPath);
    } catch (err) {
      console.error(`  ERROR converting ${file}: ${err.message}`);
    }
  }

  return renames;
}

async function updateReferences(renames) {
  // Directories to search for references
  const searchDirs = ['src/data', 'src/components', 'src/pages', 'src/lib'];
  const extensions = ['.json', '.astro', '.tsx', '.ts', '.css'];

  let totalUpdates = 0;

  async function walkDir(dir) {
    const { readdir: rd } = await import('fs/promises');
    const { statSync } = await import('fs');
    const entries = await rd(dir, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        files.push(...await walkDir(fullPath));
      } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const allFiles = [];
  for (const dir of searchDirs) {
    allFiles.push(...await walkDir(dir));
  }

  for (const filePath of allFiles) {
    let content = await readFile(filePath, 'utf-8');
    let modified = false;

    for (const { old: oldName, new: newName } of renames) {
      const oldRef = `/textures/${oldName}`;
      const newRef = `/textures/${newName}`;
      if (content.includes(oldRef)) {
        content = content.replaceAll(oldRef, newRef);
        modified = true;
        totalUpdates++;
      }
    }

    if (modified) {
      await writeFile(filePath, content, 'utf-8');
      console.log(`  Updated references in: ${filePath}`);
    }
  }

  console.log(`\nTotal reference updates: ${totalUpdates}`);
}

async function main() {
  console.log('=== WebP Conversion Script ===\n');
  const renames = await convertImages();
  console.log(`\nConverted ${renames.length} images. Updating code references...\n`);
  await updateReferences(renames);
  console.log('\nDone!');
}

main().catch(console.error);
