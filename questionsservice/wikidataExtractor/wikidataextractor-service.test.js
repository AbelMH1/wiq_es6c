const { MongoMemoryServer } = require('mongodb-memory-server');
const cron = require('node-cron');
let startJob, extractData, close;

jest.mock('node-cron', () => {
    return {
        schedule: jest.fn(),
    };
});
const consoleLogSpy = jest.spyOn(console, 'log');
const errorLogSpy = jest.spyOn(console, 'error');

let mongoServer;
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;

    ({ startJob, extractData, close } = await require('./wikidataextractor-service'));
});

afterAll(async () => {
    close();
    await mongoServer.stop();
});

afterEach(() => {
    consoleLogSpy.mockReset();
    errorLogSpy.mockReset();
});

describe('Test the Wikidata Conexion', () => {
    it('Should return a list of countryLabels and capitalLabels', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() => // Mock data to be returned by the fetch call
            Promise.resolve({
                json: () => Promise.resolve({
                    results: {
                        bindings: [
                            { countryLabel: 'Spain', capitalLabel: 'Madrid' },
                            { countryLabel: 'France', capitalLabel: 'Paris' }
                        ]
                    }
                }),
                ok: true
            })
        );
        cron.schedule.mockImplementation(async (frequency, callback) => await callback());
        await startJob();
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://query.wikidata.org/sparql?query='), expect.anything());
        expect(consoleLogSpy).toBeCalledWith(`Running a task every 30 minutes: ${Date()}`);
    });

    it('Should return an error', async () => {
        global.fetch = jest.fn().mockImplementationOnce(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    results: {
                        bindings: [
                            { countryLabel: 'Spain', capitalLabel: 'Madrid' },
                            { countryLabel: 'France', capitalLabel: 'Paris' }
                        ]
                    }
                }),
                ok: false,
                statusText: 'Debería fallar'
            })
        );
        await startJob();
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://query.wikidata.org/sparql?query='), expect.anything());
        expect(errorLogSpy).toBeCalledWith('Error al realizar la consulta a Wikidata:', 'Debería fallar');
    });
});

describe('Test the different Wikidata Queries', () => {
    it('Should return a list of countries and continents', async () => {
        global.fetch = jest.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    results: {
                        bindings: [
                            { countryLabel: 'Spain', capitalLabel: 'Madrid' },
                            { countryLabel: 'France', capitalLabel: 'Paris' }
                        ]
                    }
                }),
                ok: true
            })
        );
        cron.schedule.mockImplementation(async (frequency, callback) => await callback());
        await startJob(30, 1);
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('https://query.wikidata.org/sparql?query='), expect.anything());
        expect(consoleLogSpy).toHaveBeenNthCalledWith(2, 'Actualizando los datos sobre:');
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Países y Continentes');
    });

    it('Should return a list of countries and monuments', async () => {
        await startJob(30, 2);
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Países y Monumentos');
    });

    it('Should return a list of chemical elements and its symbols', async () => {
        await startJob(30, 3);
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Símbolos químicos');
    });

    it('Should return a list of films and directors', async () => {
        await startJob(30, 4);
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Películas y Directores');
    });

    it('Should return a list of songs and artists', async () => {
        await startJob(30, 5);
        expect(cron.schedule).toBeCalledWith(`*/30 * * * *`, expect.any(Function));
        expect(consoleLogSpy).toHaveBeenNthCalledWith(3, 'Canciones y Artistas');
    });
});