/**
 * Valida los datos de una provincia.
 * Retorna el mensaje de error como string, o null si todo está bien.
 */
export function validateProvince(data) {
    const { name, full_name } = data;

    if (!name || name.trim().length === 0) {
        return "El campo 'name' no puede estar vacío.";
    }

    if (name.trim().length < 3) {
        return "El campo 'name' debe tener al menos 3 caracteres.";
    }

    if (!full_name || full_name.trim().length === 0) {
        return "El campo 'full_name' no puede estar vacío.";
    }

    if (full_name.trim().length < 3) {
        return "El campo 'full_name' debe tener al menos 3 caracteres.";
    }

    return null; // Sin errores
}
