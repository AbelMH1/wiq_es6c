const { Pais } = require('./questiongenerator-model')

class QuestionGenerator {

    static temas = new Map([
        ["paises", [0, 1, 2]],
        ['capital', [0, 1]],
        ["lenguaje", [2]]
    ]);
    ;

    static plantillas = [
        {
            pregunta: (param) => `¿Cuál es la capital de ${param}?`,
            filtro: { pais: { $exists: true }, capital: { $exists: true } },
            campo_pregunta: 'pais',
            campo_respuesta: 'capital'
        },
        {
            pregunta: (param) => `¿De qué país es capital ${param}?`,
            filtro: { capital: { $exists: true }, pais: { $exists: true } },
            campo_pregunta: 'capital',
            campo_respuesta: 'pais'
        },
        {
            pregunta: (param) => `¿Qué lengua se habla en ${param}?`,
            filtro: { pais: { $exists: true }, lenguaje: { $exists: true } },
            campo_pregunta: 'pais',
            campo_respuesta: 'lenguaje'
        }
        // {
        //     pregunta: (param) => `¿Cuál es la bandera de ${param}?`,
        //     filtro: { bandera: { $exists: true } },
        //     campo_pregunta: 'pais',
        //     campo_respuesta: 'bandera'
        // }
    ];

    static getAvailableTopics(){
        return [ ...this.temas.keys() ];
    }

    static async generateQuestion(plantilla, respuestas) {
        console.log("\nPlantilla:");
        console.log(plantilla);

        const randomDocs = await Pais.aggregate([
            { $match: plantilla.filtro },
            { $sample: { size: respuestas } }
        ]);
        if (randomDocs.length < respuestas) {
            console.error(`Not enought data found to generate a question`);
            throw new Error(`Not enought data found to generate a question`);
        }

        console.log("\nFind:");
        console.log(randomDocs);

        var retQuestion = {
            pregunta: plantilla.pregunta(randomDocs[0][plantilla.campo_pregunta]),
            respuesta_correcta: randomDocs[0][plantilla.campo_respuesta],
            respuestas_incorrectas: Array.from({ length: respuestas-1 }, (_, i) => randomDocs[i+1][plantilla.campo_respuesta])
        };
        console.log("\nPregunta generada:");
        console.log(retQuestion);

        return retQuestion;
    }

    static async generateQuestions(preguntas, respuestas, temas) {
        console.log(temas);
        const plantillasDisponibles = this.getAvailableTemplates(temas);
        console.log(plantillasDisponibles);
        var retQuestions = [];
        for (let i = 0; i < preguntas; i++) {
            let index = Math.floor(Math.random() * plantillasDisponibles.length);
            retQuestions.push(await this.generateQuestion(this.plantillas[plantillasDisponibles[index]], respuestas));
        }
        return retQuestions;
    }

    static getAvailableTemplates(temas) {
        if (temas.length == 0) {
            return Array.from({ length: this.plantillas.length }, (_, i) => i);
        }
        var templates = [];
        temas.forEach(tema => {
            console.log(tema);
            if (this.temas.has(tema)) {
                templates = templates.concat(this.temas.get(tema));
                console.log(this.temas.get(tema));
            }
            else {
                console.error(`The topic \'${tema}\' is not currently defined`);
                throw new Error(`The topic \'${tema}\' is not currently defined`);
            }
        });
        if (templates.length == 0) {
            console.error(`No correct topics were passed`);
            throw new Error(`No correct topics were passed`);
        }
        console.log(templates);
        console.log([...new Set(templates)]);
        return [...new Set(templates)];
    }

}

module.exports = {
    QuestionGenerator
};