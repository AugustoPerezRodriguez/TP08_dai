import { ProvinceRepository }from "../repository/province-repository.js";
import { validateProvince } from "../helpers/validaciones-helpers.js";

const repository = new ProvinceRepository();

export class ProvinceService {

    async getAll() {
        return await repository.getAll();
    }

    async getById(id) {
        const province = await repository.getById(id);
        if (!province) {
            const err = new Error("Provincia no encontrada.");
            err.status = 404;
            throw err;
        }
        return province;
    }

    async create(data) {
        const errorMsg = validateProvince(data);
        if (errorMsg) {
            const err = new Error(errorMsg);
            err.status = 400;
            throw err;
        }
        return await repository.create(data);
    }

    async update(data) {
        const errorMsg = validateProvince(data);
        if (errorMsg) {
            const err = new Error(errorMsg);
            err.status = 400;
            throw err;
        }

        const updated = await repository.update(data);
        if (!updated) {
            const err = new Error("Provincia no encontrada.");
            err.status = 404;
            throw err;
        }
        return updated;
    }

    async deleteById(id) {
        const deleted = await repository.deleteById(id);
        if (!deleted) {
            const err = new Error("Provincia no encontrada.");
            err.status = 404;
            throw err;
        }
        return deleted;
    }
}
