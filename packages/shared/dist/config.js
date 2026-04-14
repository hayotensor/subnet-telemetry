"use strict";
/**
 * Shared configuration utility to handle universal settings like Ports.
 * Priority: CLI Arguments > Environment Variables > Defaults
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = getConfig;
function getCliArg(name) {
    const args = process.argv.slice(2);
    const index = args.findIndex(arg => arg === `--${name}` || arg === `-${name[0]}`);
    if (index !== -1 && args[index + 1]) {
        return args[index + 1];
    }
    // Also check for --name=value format
    const longArg = args.find(arg => arg.startsWith(`--${name}=`));
    if (longArg) {
        return longArg.split('=')[1];
    }
    return undefined;
}
function loadEnv() {
    // Only run in Node.js environments
    if (typeof process === 'undefined' || typeof process.cwd !== 'function')
        return;
    try {
        const fs = require('fs');
        const path = require('path');
        const cwd = process.cwd();
        const possiblePaths = [
            path.resolve(cwd, '.env'),
            path.resolve(cwd, '..', '.env'), // Check root from a package dir
        ];
        for (const envPath of possiblePaths) {
            if (fs.existsSync(envPath)) {
                const content = fs.readFileSync(envPath, 'utf-8');
                content.split('\n').forEach((line) => {
                    const [key, ...valueParts] = line.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
                        process.env[key.trim()] = value;
                    }
                });
            }
        }
    }
    catch (e) {
        // fs/path not available (likely browser or restricted env)
    }
}
function getConfig(defaults = {}) {
    loadEnv();
    // 1. Check CLI for --port or -p
    const cliPort = getCliArg('port');
    // 2. Check ENV for PORT
    const envPort = process.env.PORT;
    return {
        port: cliPort ? parseInt(cliPort, 10) : (envPort ? parseInt(envPort, 10) : (defaults.port || 8080)),
        host: getCliArg('host') || process.env.HOST || defaults.host || '0.0.0.0',
    };
}
