import { Router }          from "express";
import { StatusCodes }     from "http-status-codes";
import { ProvinceService } from "../services/province-service.js";

const ProvinceRouter = Router();
const service        = new ProvinceService();

// ── GET /api/province ────────────────────────────────────────────
// Retorna 200 + array de provincias
ProvinceRouter.get("/", async (req, res) => {
    // #swagger.tags = ['Provincias']
    // #swagger.summary = 'Obtiene todas las provincias'
    // #swagger.description = 'Devuelve un array con todas las provincias argentinas registradas en la base de datos. No requiere parámetros.'
    /* #swagger.responses[200] = {
            description: 'Operación exitosa. Devuelve el listado de provincias.',
            schema: [{ $ref: '#/definitions/Province' }]
    } */
    /* #swagger.responses[500] = {
            description: 'Error interno del servidor (por ejemplo, falla en la conexión a la base de datos).',
            schema: { $ref: '#/definitions/Error' }
    } */
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
    // #swagger.tags = ['Provincias']
    // #swagger.summary = 'Obtiene una provincia por id'
    // #swagger.description = 'Busca y devuelve la provincia cuyo id coincide con el parámetro de ruta.'
    /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'Id numérico de la provincia a buscar.',
            required: true,
            type: 'integer'
    } */
    /* #swagger.responses[200] = {
            description: 'Operación exitosa. Devuelve la provincia encontrada.',
            schema: { $ref: '#/definitions/Province' }
    } */
    /* #swagger.responses[404] = {
            description: 'No existe una provincia con ese id.',
            schema: { $ref: '#/definitions/NotFound' }
    } */
    /* #swagger.responses[500] = {
            description: 'Error interno del servidor.',
            schema: { $ref: '#/definitions/Error' }
    } */
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
    // #swagger.tags = ['Provincias']
    // #swagger.summary = 'Crea una nueva provincia'
    // #swagger.description = 'Crea una provincia con los datos enviados en el body. El id lo genera la base de datos. Los campos name y full_name son obligatorios y deben tener al menos 3 caracteres.'
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos de la provincia a crear (sin id).',
            required: true,
            schema: { $ref: '#/definitions/NewProvince' }
    } */
    /* #swagger.responses[201] = {
            description: 'Recurso creado. Devuelve la provincia creada con su id.',
            schema: { $ref: '#/definitions/Province' }
    } */
    /* #swagger.responses[400] = {
            description: 'Solicitud incorrecta: name o full_name vacíos o con menos de 3 caracteres.',
            schema: { $ref: '#/definitions/BadRequest' }
    } */
    /* #swagger.responses[500] = {
            description: 'Error interno del servidor.',
            schema: { $ref: '#/definitions/Error' }
    } */
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
    // #swagger.tags = ['Provincias']
    // #swagger.summary = 'Modifica una provincia existente'
    // #swagger.description = 'Actualiza la provincia indicada por el id que viaja dentro del body. Se aplican las mismas validaciones que al crear (name y full_name obligatorios, mínimo 3 caracteres).'
    /* #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos completos de la provincia, incluyendo el id de la que se quiere modificar.',
            required: true,
            schema: { $ref: '#/definitions/Province' }
    } */
    /* #swagger.responses[201] = {
            description: 'Provincia actualizada. Devuelve la provincia con los datos nuevos.',
            schema: { $ref: '#/definitions/Province' }
    } */
    /* #swagger.responses[400] = {
            description: 'Solicitud incorrecta: name o full_name vacíos o con menos de 3 caracteres.',
            schema: { $ref: '#/definitions/BadRequest' }
    } */
    /* #swagger.responses[404] = {
            description: 'No existe una provincia con el id enviado.',
            schema: { $ref: '#/definitions/NotFound' }
    } */
    /* #swagger.responses[500] = {
            description: 'Error interno del servidor.',
            schema: { $ref: '#/definitions/Error' }
    } */
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
    // #swagger.tags = ['Provincias']
    // #swagger.summary = 'Elimina una provincia por id'
    // #swagger.description = 'Elimina la provincia cuyo id coincide con el parámetro de ruta y devuelve los datos de la provincia eliminada.'
    /* #swagger.parameters['id'] = {
            in: 'path',
            description: 'Id numérico de la provincia a eliminar.',
            required: true,
            type: 'integer'
    } */
    /* #swagger.responses[200] = {
            description: 'Operación exitosa. Devuelve la provincia eliminada.',
            schema: { $ref: '#/definitions/Province' }
    } */
    /* #swagger.responses[404] = {
            description: 'No existe una provincia con ese id.',
            schema: { $ref: '#/definitions/NotFound' }
    } */
    /* #swagger.responses[500] = {
            description: 'Error interno del servidor.',
            schema: { $ref: '#/definitions/Error' }
    } */
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
