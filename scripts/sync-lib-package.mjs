#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const rootPkgPath = join(rootDir, 'package.json');
const libPkgPath = join ( rootDir, "projects/ngx-toastr/package.json" )

const rootPkg = JSON.parse(readFileSync(rootPkgPath, 'utf8'));
const libPkg = JSON.parse(readFileSync(libPkgPath, 'utf8'));

const fieldsToSync = ['name', 'version', 'description', 'author', 'license', 'repository'];

for (const field of fieldsToSync) {
  if (rootPkg[field] !== undefined) {
    libPkg[field] = rootPkg[field];
  }
}

writeFileSync(libPkgPath, `${JSON.stringify(libPkg, null, 2)}\n`);
