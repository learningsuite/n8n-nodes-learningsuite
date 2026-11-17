#!/usr/bin/env node
/**
 * Runs `@n8n/scan-community-package` against the local working tree, without publishing to npm.
 *
 * Since 0.44.0 the scanner scans local directories itself (`analyzeLocalPackage`): it lints the
 * sources (package.json + {nodes,credentials}) and the files `npm pack` would publish, with the
 * same rules as a published package. Only the npm provenance and attested source checks are
 * skipped, because they only exist after publishing.
 *
 * Two additions over `npx @n8n/scan-community-package .`:
 *   - The scanner is installed into an isolated tools directory rather than as a devDependency,
 *     so its eslint and TypeScript never end up in the tree that `npm ci` builds.
 *   - Warnings are printed as well. The scanner does not block on them and its CLI only shows
 *     them when the scan fails, but they are what the next scanner version may turn into errors.
 *
 * Usage:
 *   npm run lint:scan                         # pinned version below
 *   SCANNER_VERSION=1.3.0 npm run lint:scan   # try another version, e.g. a release candidate
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const PINNED_SCANNER = '0.44.0';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const packageDir = path.resolve(scriptDir, '..');
const toolsDir = path.join(scriptDir, '.scan-tools');
const scannerDir = path.join(toolsDir, 'node_modules/@n8n/scan-community-package');

const wantedScanner = process.env.SCANNER_VERSION || PINNED_SCANNER;
const scannerManifest = path.join(scannerDir, 'package.json');
const installedScanner = existsSync(scannerManifest)
	? JSON.parse(readFileSync(scannerManifest, 'utf8')).version
	: undefined;

// A stale install would silently scan with an older rule set, so reinstall whenever the version moves.
if (installedScanner !== wantedScanner) {
	if (installedScanner) {
		console.log(`Scanner ${installedScanner} is installed, but ${wantedScanner} is wanted - reinstalling ...`);
	}
	rmSync(toolsDir, { recursive: true, force: true });
	mkdirSync(toolsDir, { recursive: true });
	const manifest = {
		name: 'learningsuite-scan-tools',
		private: true,
		description: 'Isolated install of the n8n community-package scanner. Not part of the package.',
		dependencies: { '@n8n/scan-community-package': wantedScanner },
	};
	writeFileSync(path.join(toolsDir, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
	console.log(`Installing @n8n/scan-community-package ${wantedScanner} into scripts/.scan-tools ...`);
	execFileSync('npm', ['install', '--silent', '--no-audit', '--no-fund'], { cwd: toolsDir, stdio: 'inherit' });
}

const scanner = await import(pathToFileURL(path.join(scannerDir, 'dist/scanner.js')).href);
if (typeof scanner.analyzeLocalPackage !== 'function') {
	console.error(`@n8n/scan-community-package ${wantedScanner} has no analyzeLocalPackage (needs >= 0.44.0).`);
	process.exit(1);
}

console.log(`Scanning with @n8n/scan-community-package ${wantedScanner}`);
if (!existsSync(path.join(packageDir, 'dist'))) {
	console.log('! dist/ not found - run `npm run build` first, otherwise the published files are not linted');
}

const result = await scanner.analyzeLocalPackage(packageDir);

if (!result.passed) {
	console.log(`FAIL: ${result.message}`);
	if (result.details) console.log(result.details);
	process.exit(scanner.getExitCode(result));
}

// Passed: errors are ruled out, so list the warnings the CLI would not show.
const { ESLint } = await import(pathToFileURL(path.join(toolsDir, 'node_modules/eslint/lib/api.js')).href);
const eslint = new ESLint({
	cwd: packageDir,
	allowInlineConfig: false,
	overrideConfigFile: true,
	overrideConfig: await scanner.buildScanConfig(),
});
const lintResults = await eslint.lintFiles(scanner.SOURCE_FILE_PATTERNS);
const warnings = lintResults.reduce((sum, r) => sum + r.warningCount, 0);

if (warnings > 0) {
	console.log((await eslint.loadFormatter('stylish')).format(lintResults));
}
console.log(
	`PASS (${result.skippedChecks?.join(' + ') ?? 'no'} checks skipped locally, ${warnings} warning(s) in the source)`,
);
