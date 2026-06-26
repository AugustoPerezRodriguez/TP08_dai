import { Router }          from "express";
import { StatusCodes }     from "http-status-codes";
import { ProvinceService } from "../services/province-service.js";

const ProvinceRouter = Router();
const service        = new ProvinceService();

// ── GET /api/province ────────────────────────────────────────────
// Retorna 200 + array de provincias
ProvinceRouter.get("/", async (req, res) => {
    try {
        const provinces = await service.getAll();
        return res.status(StatusCodes.OK).json(provinces);
    } catch (error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

// ── GET /api/province/:id ────────────────────────────────────────
// Retorna 200 + provincia   |   404 si no existe
ProvinceRouter.get("/:id", async (req, res) => {
    try {
        const id       = parseInt(req.params.id);
        const province = await service.getById(id);
        return res.status(StatusCodes.OK).json(province);
    } catch (error) {
        const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(status).json({ message: error.message });
    }
});

// ── POST /api/province ───────────────────────────────────────────
// Body: { name, full_name, latitude, longitude, display_order }
// Retorna 201 + provincia creada   |   400 si hay error de validación
ProvinceRouter.post("/", async (req, res) => {
    try {
        const newProvince = await service.create(req.body);
        return res.status(StatusCodes.CREATED).json(newProvince);
    } catch (error) {
        const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(status).json({ message: error.message });
    }
});

// ── PUT /api/province ────────────────────────────────────────────
// Body: { id, name, full_name, latitude, longitude, display_order }
// Retorna 201 + provincia actualizada   |   404 si no existe   |   400 si validación falla
ProvinceRouter.put("/", async (req, res) => {
    try {
        const updatedProvince = await service.update(req.body);
        return res.status(StatusCodes.CREATED).json(updatedProvince);
    } catch (error) {
        const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(status).json({ message: error.message });
    }
});

// ── DELETE /api/province/:id ─────────────────────────────────────
// Retorna 200 + provincia eliminada   |   404 si no existe
ProvinceRouter.delete("/:id", async (req, res) => {
    try {
        const id      = parseInt(req.params.id);
        const deleted = await service.deleteById(id);
        return res.status(StatusCodes.OK).json(deleted);
    } catch (error) {
        const status = error.status || StatusCodes.INTERNAL_SERVER_ERROR;
        return res.status(status).json({ message: error.message });
    }
});

export default ProvinceRouter;
