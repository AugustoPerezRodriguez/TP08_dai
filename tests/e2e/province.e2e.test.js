import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const BASE_URL = "http://localhost:3000";
let server;

function waitForServer(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();

        const check = async () => {
            try {
                const response = await fetch(url);
                resolve(response);
                return;
            } catch (error) {
                if (Date.now() - start >= timeout) {
                    reject(new Error(`El servidor no estuvo disponible a tiempo: ${error.message}`));
                    return;
                }
                setTimeout(check, 250);
            }
        };

        check();
    });
}

before(async () => {
    server = spawn(process.execPath, ["index.js"], {
        cwd: process.cwd(),
        env: process.env,
        stdio: "ignore"
    });

    await waitForServer(`${BASE_URL}/api/province`);
});

test("E2E - GET /api/province responde con las provincias", async () => {
    const response = await fetch(`${BASE_URL}/api/province`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.ok(Array.isArray(body));
    assert.ok(body.length > 0);
    assert.equal(typeof body[0].full_name, "string");
});

test("E2E - GET /api/province/:id responde 404 para una provincia inexistente", async () => {
    const response = await fetch(`${BASE_URL}/api/province/-1`);
    const body = await response.json();

    assert.equal(response.status, 404);
    assert.equal(body.message, "Provincia no encontrada.");
});

after(() => {
    if (server && !server.killed) {
        server.kill();
    }
});
