import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import { ProvinceRepository } from "../../src/repository/province-repository.js";
import pool from "../../src/configs/db-config.js";

const repository = new ProvinceRepository();

before(async () => {
    // La prueba solo necesita una conexión de lectura. No crea, modifica ni elimina datos.
    await pool.query("SELECT 1");
});

test("Integrador - ProvinceRepository obtiene una provincia existente desde PostgreSQL", async () => {
    const province = await repository.getById(1);

    assert.ok(province);
    assert.equal(province.id, 1);
    assert.equal(typeof province.name, "string");
    assert.equal(typeof province.full_name, "string");
});

test("Integrador - ProvinceRepository devuelve null cuando el id no existe", async () => {
    const province = await repository.getById(-1);

    assert.equal(province, null);
});

after(async () => {
    await pool.end();
});
