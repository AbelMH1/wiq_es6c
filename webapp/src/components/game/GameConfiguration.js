import React, { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { Footer } from '../footer/Footer';
import { Nav } from '../nav/Nav';


const GameConfiguration = (configureNumErrors) => {

  // Almacen de temáticas 
  const [tematicasSeleccionadas, setTematicasSeleccionadas] = useState([]);
  // Almacen para el número de preguntas
  const [numPreguntas, setNumPreguntas] = useState(1); 
  // Almacen de mensaje de error para el spinner
  const [error, setError] = useState(null); 
  // Almacen del número de errores
  const [numeroErrores, setNumeroErrores] = useState("ninguno");


  const handleTematicaChange = (event) => {
    const tematicaSeleccionada = event.target.value;

    if (tematicasSeleccionadas.includes(tematicaSeleccionada)) {
      // Si está seleccionada -> la eliminamos
      setTematicasSeleccionadas(
        tematicasSeleccionadas.filter(tema => tema !== tematicaSeleccionada));
    } else {
      setTematicasSeleccionadas([...tematicasSeleccionadas, tematicaSeleccionada]);
    }
  };

  const handleNumPreguntasChange = (event) => {
    const nuevoValor = parseInt(event.target.value, 10);

    if (!isNaN(nuevoValor) && nuevoValor > 0) {
      setNumPreguntas(nuevoValor);
      setError(null); // Reseteamos el error si el valor es válido
    } else {
      setError("El número de preguntas debe ser mayor que 0");
    }
  };

  const handleChange = (event) => {
    setNumeroErrores(event.target.value);
  };


  return (
    <>
      <Nav />
      <Container component="main" maxWidth="xl" sx={{ marginTop: 4 }}>

        <h2>Configuración de la partida</h2>
    
        <div className="configureTopic">

          <h3>Selecciona las temáticas</h3>

          <div>
            <input
              type="checkbox"
              id="t1"
              value="Arte"
              checked={tematicasSeleccionadas.includes('Arte')}
              onChange={handleTematicaChange}
            />
            <label htmlFor="tematica1">Arte</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t2"
              value="Ciencia"
              checked={tematicasSeleccionadas.includes('Ciencia')}
              onChange={handleTematicaChange}
            />
            <label htmlFor="tematica2">Ciencia</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t3"
              value="Geografía"
              checked={tematicasSeleccionadas.includes('Geografía')}
              onChange={handleTematicaChange}
            />
            <label htmlFor="tematica3">Geografía</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t4"
              value="Deporte"
              checked={tematicasSeleccionadas.includes('Deporte')}                
              onChange={handleTematicaChange}
              />
            <label htmlFor="tematica4">Deporte</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="t5"
              value="Entretenimiento"
              checked={tematicasSeleccionadas.includes('Entretenimiento')}                
              onChange={handleTematicaChange}
              />
            <label htmlFor="tematica4">Entretenimiento</label>
          </div>
    
        </div>


        <div className="configureNumberOfQuestions">

          <h3>Selecciona el número de preguntas</h3>

          <div>
            <label htmlFor="numPreguntas">Número de preguntas:</label>
            <input
              type="number"
              id="numPreguntas"
              value={numPreguntas}
              onChange={handleNumPreguntasChange}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </div>

        </div>
        
        
        {{configureNumErrors} ? (
          <div className="configureNumberOfErrors">

            <h3>Selecciona el número de errores permitidos</h3>

            <div>
              <label htmlFor="numErrores">Número de errores permitidos:</label>
              <select id="numErrores" value={numeroErrores} onChange={handleChange}>
                <option value="ninguno">Ninguno</option>
                <option value="1">1</option>
                <option value="3">3</option>
                <option value="5">5</option>
              </select>
            </div>

          </div>
        ) : (
          <div></div>
        )}


        <button>Comenzar Juego</button>
  
            
      </Container>
      <Footer />
    </>
  );

};

export default GameConfiguration;