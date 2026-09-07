# Documentación de tests - TP08 DAI

## 1. Objetivo

Se agregaron tres niveles de pruebas al TP08 DAI sin modificar el código existente de la aplicación ni realizar cambios estructurales o de datos en la base de datos.

Los tests fueron implementados utilizando las herramientas nativas de Node.js (`node:test` y `node:assert/strict`). De esta manera no es necesario agregar Jest, Mocha, Supertest ni otras dependencias al proyecto original.

La aplicación implementa una API REST de provincias argentinas con la siguiente arquitectura:

```text
HTTP
  ↓
ProvinceRouter / Controller
  ↓
ProvinceService
  ↓
ProvinceRepository
  ↓
PostgreSQL
```

Los tests se ubicaron en una carpeta independiente `tests/`, para mantener separado el código de pruebas del código productivo.

---

## 2. Estructura agregada

```text
tests/
├── unit/
│   └── validaciones-helpers.test.js
├── integration/
│   └── province-repository.test.js
└── e2e/
    └── province.e2e.test.js

documentacion.md
```

No se modificaron `index.js`, controllers, services, repositories, entidades, helpers ni `bd.sql`.

---

# 3. Test unitario

## Archivo

`tests/unit/validaciones-helpers.test.js`

## Qué se prueba

Se prueba de forma aislada la función `validateProvince`, ubicada en:

`src/helpers/validaciones-helpers.js`

Esta función recibe los datos de una provincia y devuelve:

- `null` cuando los datos básicos son válidos.
- Un mensaje de error cuando `name` o `full_name` están vacíos o tienen menos de tres caracteres.

## Por qué es unitario

Es unitario porque se prueba una única unidad de comportamiento sin utilizar Express ni PostgreSQL.

El test importa directamente la función y le entrega objetos JavaScript como entrada.

No se utiliza la base de datos y tampoco se necesita levantar el servidor.

## Casos elegidos

### Provincia válida

Se envía:

```js
{
    name: "Buenos Aires",
    full_name: "Provincia de Buenos Aires"
}
```

Se espera `null`, porque no existe ningún error de validación.

### `name` vacío

Se utiliza `"   "` para comprobar que la función también considera vacío un texto formado solamente por espacios.

Se espera:

```text
El campo 'name' no puede estar vacío.
```

### `name` demasiado corto

Se utiliza `"BA"`, que tiene dos caracteres.

Se espera:

```text
El campo 'name' debe tener al menos 3 caracteres.
```

## Funcionamiento de las herramientas

`node:test` proporciona la función `test()` para declarar cada caso de prueba.

`node:assert/strict` proporciona las aserciones. En este archivo se utiliza `assert.equal()` para comparar el resultado real con el esperado.

---

# 4. Test integrador

## Archivo

`tests/integration/province-repository.test.js`

## Qué se prueba

Se prueba `ProvinceRepository` utilizando la conexión real configurada por el proyecto en:

`src/configs/db-config.js`

El repository ejecuta consultas SQL reales contra PostgreSQL.

Se eligió `getById()` porque permite comprobar la integración entre:

```text
ProvinceRepository
       ↓
pg Pool
       ↓
PostgreSQL
       ↓
resultado SQL
```

## Por qué es integrador

A diferencia del test unitario, acá no se reemplaza el acceso a PostgreSQL por un mock.

La prueba comprueba que el repository y el driver `pg` pueden comunicarse correctamente con la base de datos y que el resultado obtenido tiene la estructura esperada.

## Importante: no se modifica la BD

Los dos casos utilizan únicamente `SELECT` a través del método existente `getById()`.

No se ejecutan:

- `INSERT`
- `UPDATE`
- `DELETE`
- `CREATE`
- `DROP`
- `ALTER`

Por lo tanto, el test no agrega, modifica ni elimina registros.

## Casos elegidos

### ID existente

Se consulta el ID `1`.

Se verifica que:

- exista una provincia;
- su `id` sea `1`;
- `name` sea un string;
- `full_name` sea un string.

### ID inexistente

Se consulta el ID `-1`.

El repository existente devuelve `null` cuando la consulta no encuentra registros, por lo que el test comprueba exactamente ese comportamiento.

## `before()`

Antes de ejecutar los tests se realiza:

```sql
SELECT 1
```

Esto sirve para comprobar que PostgreSQL está disponible y que la configuración de conexión del proyecto funciona.

No modifica datos.

## `after()`

Al terminar las pruebas se ejecuta `pool.end()` para cerrar las conexiones abiertas por PostgreSQL y evitar que el proceso de Node quede esperando por conexiones activas.

---

# 5. Test punta a punta (E2E)

## Archivo

`tests/e2e/province.e2e.test.js`

## Qué se prueba

Se prueba la API desde afuera, utilizando HTTP real.

El test inicia el archivo existente `index.js`, que levanta Express en el puerto `3000`.

Luego realiza requests HTTP reales utilizando `fetch`.

El recorrido es:

```text
fetch()
   ↓
HTTP
   ↓
Express
   ↓
/api/province
   ↓
ProvinceRouter
   ↓
ProvinceService
   ↓
ProvinceRepository
   ↓
PostgreSQL
   ↓
HTTP Response
   ↓
assert
```

## Por qué es E2E

Se considera punta a punta porque la prueba comienza desde el comportamiento de un cliente HTTP y atraviesa las principales capas reales de la aplicación hasta llegar a PostgreSQL.

No se llama directamente al service ni al repository.

## Casos elegidos

### GET `/api/province`

Se realiza:

```http
GET http://localhost:3000/api/province
```

Se espera:

- HTTP `200`;
- un array como respuesta;
- al menos un elemento;
- que `full_name` sea un string.

### GET `/api/province/-1`

Se realiza:

```http
GET http://localhost:3000/api/province/-1
```

Como el ID no existe, el service genera el error `404` definido por el proyecto.

Se comprueba:

```text
status = 404
message = "Provincia no encontrada."
```

## Inicio y cierre del servidor

El test utiliza `spawn()` para iniciar:

```text
node index.js
```

Antes de realizar las pruebas, `waitForServer()` intenta conectarse al endpoint hasta que el servidor esté disponible o se alcance un timeout de 10 segundos.

Al finalizar, `server.kill()` detiene el proceso creado por el test.

Esto permite que el test E2E sea ejecutable sin tener que dejar manualmente `npm start` corriendo.

---

# 6. Decisiones tomadas

## No modificar código existente

Se decidió no agregar exportaciones, parámetros, funciones auxiliares ni cambios en controllers/services/repositories.

Esto es importante porque la consigna solicita entregar tests sobre el TP anterior, no refactorizar la aplicación.

## No modificar la base de datos

El test unitario no utiliza PostgreSQL.

El test integrador únicamente consulta datos existentes.

El test E2E utiliza endpoints GET, que tampoco modifican información.

Por esta razón no fue necesario crear una base de datos de testing ni ejecutar scripts SQL adicionales.

## Usar herramientas nativas de Node.js

El `package.json` original no incluye una librería de testing.

Se decidió utilizar:

- `node:test`
- `node:assert/strict`
- `node:child_process`

Estas APIs están disponibles en versiones modernas de Node.js y permiten agregar las pruebas sin incorporar dependencias nuevas al proyecto.

## Separar los tres niveles

Cada tipo de prueba está en su propia carpeta para que sea evidente qué parte corresponde a cada nivel:

```text
unit        → lógica aislada
integration → integración con PostgreSQL
E2E         → aplicación completa mediante HTTP
```

---

# 7. Cómo ejecutar los tests

## Test unitario

Desde la raíz del proyecto:

```bash
node --test tests/unit/validaciones-helpers.test.js
```

Este test no necesita PostgreSQL ni servidor Express.

## Test integrador

Primero deben estar configuradas las variables de conexión que utiliza `db-config.js`:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USER
DB_PASSWORD
```

Luego:

```bash
node --test tests/integration/province-repository.test.js
```

El test necesita poder conectarse a la misma base configurada para el proyecto.

## Test E2E

También necesita que la aplicación pueda conectarse correctamente a PostgreSQL.

Se ejecuta con:

```bash
node --test tests/e2e/province.e2e.test.js
```

El propio test inicia `index.js` en el puerto `3000` y lo detiene al terminar.

Por lo tanto, no se debe iniciar simultáneamente otro servidor del TP en el puerto `3000`.

---

# 8. Diferencia entre los tres tests

| Tipo | Qué prueba | PostgreSQL | HTTP | Código aislado |
|---|---|---:|---:|---:|
| Unitario | `validateProvince` | No | No | Sí |
| Integrador | `ProvinceRepository` + `pg` + BD | Sí | No | Parcialmente |
| E2E | API completa | Sí | Sí | No |

La diferencia principal es el alcance.

El unitario busca detectar errores en una función individual.

El integrador busca detectar errores en la comunicación entre componentes reales.

El E2E busca verificar que el sistema completo responde correctamente a una operación real de un cliente.

---

# 9. Qué demostrar en la defensa oral

Una explicación breve y correcta sería:

> "Agregué tres niveles de testing sin modificar el código original ni la base de datos. El test unitario prueba directamente la función de validación, sin dependencias externas. El integrador utiliza el repository real y PostgreSQL para comprobar que la consulta y la conexión funcionan correctamente. Finalmente, el E2E levanta la aplicación y hace requests HTTP reales contra los endpoints, atravesando router, service, repository y base de datos. Elegí operaciones de lectura para garantizar que los tests no modifiquen los datos existentes."

Una diferencia importante para mencionar es que un test E2E no es simplemente otro test de un endpoint: lo que lo caracteriza es que se prueba el sistema desde el punto de vista del cliente y se atraviesa el flujo completo de la aplicación.
