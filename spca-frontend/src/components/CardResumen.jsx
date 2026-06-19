import "./CardResumen.css";
import React from 'react';

function CardResumen({ titulo, cantidad, tendencia, esPositiva, icono, colorIcono }) {
    return (
        <div className="card border-0 shadow-sm p-3 flex-fill" style={{ borderRadius: '16px', minWidth: '220px' }}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    <span className="text-muted fw-semibold small d-block mb-1">{titulo}</span>
                    <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: '2rem' }}>{cantidad}</h2>
                    <span className={`small fw-bold ${esPositiva ? 'text-success' : 'text-danger'}`}>
                        {tendencia}
                    </span>
                </div>
                
                {/* Caja del Icono Flotante estilo Figma */}
                <div 
                    className="d-flex align-items-center justify-content-center" 
                    style={{ 
                        width: '52px', 
                        height: '52px', 
                        backgroundColor: `${colorIcono}15`, // Agrega opacidad al fondo
                        borderRadius: '12px' 
                    }}
                >
                    <i className={`bi bi-${icono}`} style={{ fontSize: '1.4rem', color: colorIcono }}></i>
                </div>
            </div>
        </div>
    );
}

export default CardResumen;