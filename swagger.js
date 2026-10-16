
import swaggerAutogen from 'swagger-autogen';

const swagger = swaggerAutogen();

const doc = {
    info: {
        title: 'API de Provincias',
        description: 'Documentación de la API de Provincias',
        version: '1.0.0'
    },
    host: 'localhost:3000',
    schemes: ['http'],
    tags: [
        { name: 'Provincias', description: 'Operaciones CRUD sobre las provincias argentinas' }
    ],
    definitions: {
        Province: {
            id: 1,
            name: 'Buenos Aires',
            full_name: 'Provincia de Buenos Aires',
            latitude: -36.6769415,
            longitude: -60.5588319,
            display_order: 1
        },
        NewProvince: {
            $name: 'Catamarca',
            $full_name: 'Provincia de Catamarca',
            latitude: -28.4696,
            longitude: -65.7795,
            display_order: 3
        },
        BadRequest: {
            message: "El campo 'name' debe tener al menos 3 caracteres."
        },
        NotFound: {
            message: 'Provincia no encontrada.'
        },
        Error: {
            message: 'Descripción del error interno.'
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js'];

swagger(outputFile, endpointsFiles, doc);
