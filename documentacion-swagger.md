# Documentación de la API con Swagger — TP08

## 1. Descripción del proyecto

**API de Provincias** es una API REST que permite consultar y administrar las 24 provincias argentinas. Está hecha con **Node.js**, **Express** y **PostgreSQL**, y la documentación se genera con **Swagger** (OpenAPI 2.0).

El proyecto tiene una arquitectura en capas. Cada capa tiene una sola responsabilidad y solo se comunica con la capa siguiente:

```
Cliente (Swagger UI / Postman)
        │  HTTP
        ▼
Controller   src/controllers/province-controller.js
        │  Recibe la request, llama al service y arma la respuesta HTTP (código + JSON).
        ▼
Service      src/services/province-service.js
        │  Aplica las reglas de negocio: valida los datos y lanza errores 400 / 404.
        ▼
Repository   src/repository/province-repository.js
        │  Ejecuta las consultas SQL contra PostgreSQL.
        ▼
Base de datos PostgreSQL (tabla provinces)
```

Además hay piezas de apoyo:

| Archivo | Función |
|---|---|
| `src/configs/db-config.js` | Crea el pool de conexiones a PostgreSQL con los datos del `.env`. |
| `src/helpers/validaciones-helpers.js` | Función `validateProvince`: valida `name` y `full_name`. |
| `src/entities/province.js` | Clase `Province` con las propiedades de la entidad. |
| `index.js` | Arma el servidor Express, monta el router en `/api/province` y la documentación en `/api-docs`. |

## 2. Justificación

Elegimos documentar esta API porque:

- Es la API propia del TP08, así que conocemos todo su código y podemos documentarla con precisión.
- Tiene un **CRUD completo** (listar, buscar por id, crear, modificar y eliminar).
- Tiene **validaciones** (por ejemplo, `name` y `full_name` deben tener al menos 3 caracteres) y **manejo de errores**. Por eso cada endpoint tiene varios códigos de respuesta para documentar: 200, 201, 400, 404 y 500.

## 3. Datos de la API

- **URL base:** `http://localhost:3000/api/province`
- **Documentación interactiva:** `http://localhost:3000/api-docs`
- **Formato:** JSON (request y response)

### Endpoints

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| GET | `/api/province` | Obtiene todas las provincias. | 200, 500 |
| GET | `/api/province/{id}` | Obtiene una provincia por su id. | 200, 404, 500 |
| POST | `/api/province` | Crea una provincia nueva con los datos del body. El id lo genera la base. | 201, 400, 500 |
| PUT | `/api/province` | Modifica la provincia cuyo id viaja dentro del body. | 201, 400, 404, 500 |
| DELETE | `/api/province/{id}` | Elimina una provincia por su id y devuelve la provincia eliminada. | 200, 404, 500 |

## 4. Modelo

### Province

| Propiedad | Tipo | Descripción |
|---|---|---|
| `id` | integer | Identificador único. Lo genera la base de datos (`SERIAL`). |
| `name` | string | Nombre corto de la provincia. Obligatorio, mínimo 3 caracteres. |
| `full_name` | string | Nombre oficial completo. Obligatorio, mínimo 3 caracteres. |
| `latitude` | number | Latitud geográfica de la provincia. |
| `longitude` | number | Longitud geográfica de la provincia. |
| `display_order` | integer | Orden en el que se muestra la provincia en un listado. |

Ejemplo:

```json
{
  "id": 1,
  "name": "Buenos Aires",
  "full_name": "Provincia de Buenos Aires",
  "latitude": -36.6769415,
  "longitude": -60.5588319,
  "display_order": 1
}
```

### Otros modelos documentados

| Modelo | Uso |
|---|---|
| `NewProvince` | Body del POST. Es igual a `Province` pero sin `id`. `name` y `full_name` están marcados como obligatorios. |
| `BadRequest` | Respuesta 400. Ejemplo: `{ "message": "El campo 'name' debe tener al menos 3 caracteres." }` |
| `NotFound` | Respuesta 404: `{ "message": "Provincia no encontrada." }` |
| `Error` | Respuesta 500: `{ "message": "..." }` con la descripción del error interno. |

## 5. Implementación de Swagger

La documentación se genera automáticamente a partir del código. Estas son las piezas:

**`swagger.js` (generador).** Usa la librería `swagger-autogen`. Define los datos generales de la API (título, versión, host, esquema, tags) y llama a autogen con `index.js` como archivo de entrada. Autogen lee `index.js`, encuentra `app.use("/api/province", ProvinceRouter)` y sigue el router hasta el controller. Así arma cada ruta con su prefijo completo. El resultado se guarda en `swagger-output.json`.

**Comentarios `#swagger.*` en el controller.** Autogen detecta solo el método y la ruta. Todo lo demás lo agregamos con comentarios especiales dentro de cada endpoint:
- `#swagger.tags`: agrupa los endpoints bajo "Provincias".
- `#swagger.summary` y `#swagger.description`: el título corto y la explicación del endpoint.
- `#swagger.parameters[...]`: describe los parámetros (`id` en la ruta, o el `body` con su esquema).
- `#swagger.responses[código]`: describe cada respuesta posible con su esquema.

**`definitions` (modelos).** En `swagger.js` se definen los modelos (`Province`, `NewProvince`, `BadRequest`, `NotFound`, `Error`) con valores de ejemplo. Los comentarios del controller los referencian con `$ref: '#/definitions/...'`, y Swagger UI los muestra en la sección **Models** al final de la página.

**`swagger-ui-express` (visualización).** En `index.js` se importa `swagger-output.json` y se sirve en `/api-docs` con `app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile))`. Ahí se ve la documentación interactiva y se pueden probar los endpoints con **Try it out**.

**Script `npm run swagger`.** Ejecuta `node swagger.js` y regenera `swagger-output.json`. Hay que correrlo cada vez que se cambia un endpoint o un comentario `#swagger.*`, y después reiniciar el servidor.

## 6. Problemas encontrados y solución

| # | Problema | Causa | Solución |
|---|---|---|---|
| 1 | Las rutas aparecían como `/` y `/{id}`, sin el prefijo `/api/province`. | `swagger.js` apuntaba solo al controller, así que autogen no sabía en qué ruta estaba montado el router. | Se cambió `endpointsFiles` para que apunte a `./index.js`. Así autogen ve el `app.use("/api/province", ...)`. |
| 2 | Los endpoints no tenían descripción ni nombre. | Autogen no lee los comentarios comunes (`// ...`). | Se agregaron los comentarios `#swagger.tags`, `#swagger.summary` y `#swagger.description`. |
| 3 | Las respuestas aparecían solo como `default`. | Autogen no interpreta constantes como `StatusCodes.OK` de `http-status-codes`. Solo detecta números literales. | Se documentó cada respuesta a mano con `#swagger.responses[código]`. |
| 4 | Al probar desde Swagger, el GET devolvía 500 con `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string`. | No existía el archivo `.env` (está en `.gitignore`), así que `DB_PASSWORD` llegaba como `undefined`. | Se creó el `.env` con los datos de conexión y se reinició el servidor. |
| 5 | Un id no numérico (por ejemplo `/api/province/abc`) devuelve **500** en lugar de **400**. | `parseInt("abc")` da `NaN` y PostgreSQL rechaza la consulta. El error no tiene `status`, así que el controller responde 500. | Pendiente (mejora). Habría que validar el id en el controller o el service y lanzar un 400. |
| 6 | El PUT devuelve **201 Created** aunque no crea nada. | El controller usa `StatusCodes.CREATED` en el PUT. Lo correcto para una modificación es 200 OK. | Se documentó como 201 para que coincida con el comportamiento real. Queda como mejora cambiarlo a 200. |
| 7 | El GET de todas las provincias devuelve solo `full_name`, mientras que la documentación indica un array de `Province` completo. | La consulta del repository es `SELECT full_name FROM provinces`. | Pendiente (mejora). Cambiar la consulta a `SELECT *` para que coincida con la documentación. |
| 8 | `latitude` y `longitude` llegan como texto (`"-36.6769415000"`) y no como number. | La librería `pg` devuelve las columnas `DECIMAL` como string para no perder precisión. | Pendiente (mejora). Convertir los valores con `parseFloat` o cambiar el tipo de columna. |

## 7. Evidencias

Las capturas se tomaron desde `http://localhost:3000/api-docs` con **Try it out → Execute**. En cada una se ven los datos enviados, la Request URL, el Response body y el Code.

> Reemplazar cada `capturas/XX.png` por la imagen correspondiente y completar la frase de verificación con el resultado obtenido.

### 7.1 Pantalla principal

![Pantalla principal con los 5 endpoints](capturas/00-principal.png)

Se ven los 5 endpoints agrupados bajo el tag **Provincias**.

### 7.2 Pruebas de los endpoints

| # | Prueba | Datos enviados | Esperado según la documentación |
|---|---|---|---|
| 1 | GET todas | — | 200 con la lista de 24 provincias |
| 2 | GET por id | `id = 1` | 200 con Buenos Aires |
| 3 | GET por id inexistente | `id = 9999` | 404 `Provincia no encontrada.` |
| 4 | POST válido | Ejemplo del body con otro nombre | 201 con la provincia creada y su id |
| 5 | POST inválido | `"name": "ab"` | 400 `El campo 'name' debe tener al menos 3 caracteres.` |
| 6 | PUT | id de la prueba 4 con un dato cambiado | 201 con la provincia actualizada |
| 7 | GET por id | id de la prueba 4 | 200 con el cambio de la prueba 6 guardado |
| 8 | DELETE | id de la prueba 4 | 200 con la provincia eliminada |
| 9 | DELETE de nuevo | mismo id | 404 `Provincia no encontrada.` (prueba que se borró) |

**Prueba 1 — GET todas**

![GET todas](capturas/01-get-todas.png)

Se esperaba 200 según la documentación y se obtuvo ___.

**Prueba 2 — GET por id (id = 1)**

![GET por id](capturas/02-get-id.png)

Se esperaba 200 con Buenos Aires según la documentación y se obtuvo ___.

**Prueba 3 — GET por id inexistente (id = 9999)**

![GET por id inexistente](capturas/03-get-id-inexistente.png)

Se esperaba 404 según la documentación y se obtuvo ___.

**Prueba 4 — POST válido**

![POST válido](capturas/04-post-valido.png)

Se esperaba 201 según la documentación y se obtuvo ___. Id generado: ___.

**Prueba 5 — POST inválido ("name": "ab")**

![POST inválido](capturas/05-post-invalido.png)

Se esperaba 400 con el mensaje de validación según la documentación y se obtuvo ___.

**Prueba 6 — PUT**

![PUT](capturas/06-put.png)

Se esperaba 201 según la documentación y se obtuvo ___.

**Prueba 7 — GET por id (verificación del PUT)**

![GET después del PUT](capturas/07-get-despues-put.png)

Se esperaba 200 con los datos modificados y se obtuvo ___.

**Prueba 8 — DELETE**

![DELETE](capturas/08-delete.png)

Se esperaba 200 con la provincia eliminada según la documentación y se obtuvo ___.

**Prueba 9 — DELETE de nuevo**

![DELETE repetido](capturas/09-delete-repetido.png)

Se esperaba 404 según la documentación y se obtuvo ___.

### 7.3 Endpoints desplegados sin ejecutar

![Endpoint desplegado 1](capturas/10-detalle-get-id.png)

![Endpoint desplegado 2](capturas/11-detalle-post.png)

![Endpoint desplegado 3](capturas/12-detalle-put.png)

Se ven la descripción, los parámetros y las respuestas posibles de cada endpoint.

### 7.4 Sección Models

![Models](capturas/13-models.png)

Se ven los modelos `Province`, `NewProvince`, `BadRequest`, `NotFound` y `Error`.

## 8. Acceso

### Requisitos
- Node.js (versión con soporte de `import ... with { type: "json" }`, por ejemplo 20.10 o superior)
- PostgreSQL y pgAdmin

### Pasos para levantar el proyecto

1. **Cargar la base de datos.** En pgAdmin, crear una base (por ejemplo `provinces_db`). Abrir el **Query Tool** sobre esa base, abrir `bd.sql` y ejecutarlo con F5. Se crea la tabla `provinces` con las 24 provincias.

2. **Configurar la conexión.** Crear un archivo `.env` en la raíz del proyecto:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=provinces_db
   DB_USER=postgres
   DB_PASSWORD=tu_contraseña
   ```

3. **Instalar las dependencias:**
   ```bash
   npm install
   ```

4. **Generar la documentación:**
   ```bash
   npm run swagger
   ```

5. **Levantar el servidor:**
   ```bash
   npm start
   ```

6. **Abrir la documentación** en el navegador: <http://localhost:3000/api-docs>
