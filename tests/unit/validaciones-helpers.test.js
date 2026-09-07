import test from "node:test";
import assert from "node:assert/strict";
import { validateProvince } from "../../src/helpers/validaciones-helpers.js";

test("Unitario - validateProvince acepta una provincia válida", () => {
    const province = {
        name: "Buenos Aires",
        full_name: "Provincia de Buenos Aires"
    };

    const result = validateProvince(province);

    assert.equal(result, null);
});

test("Unitario - validateProvince rechaza un name vacío", () => {
    const province = {
        name: "   ",
        full_name: "Provincia de Buenos Aires"
    };

    const result = validateProvince(province);

    assert.equal(result, "El campo 'name' no puede estar vacío.");
});

test("Unitario - validateProvince rechaza un name con menos de 3 caracteres", () => {
    const province = {
        name: "BA",
        full_name: "Provincia de Buenos Aires"
    };

    const result = validateProvince(province);

    assert.equal(result, "El campo 'name' debe tener al menos 3 caracteres.");
});
