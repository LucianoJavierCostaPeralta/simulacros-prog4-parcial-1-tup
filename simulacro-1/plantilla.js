// ============================================================
//  SIMULACRO PARCIAL 1 — Programación IV — UTN FRRe
//  Datos del problema: "PetroSur S.A."
//  NO modificar este bloque. Copialo al principio de tu archivo.
// ============================================================

const PUERTO_ORIGEN = "Puerto Rosales";

// Coordenadas en grados decimales (latitud negativa = sur, longitud negativa = oeste).
// factorRuta: la ruta real por mar es más larga que la línea recta (hay costa que rodear).
const PUERTOS = [
  { nombre: "Puerto Rosales",  lat: -38.93, lon: -62.07, factorRuta: 1.00 },
  { nombre: "Montevideo",      lat: -34.90, lon: -56.21, factorRuta: 1.25 },
  { nombre: "Rio Grande",      lat: -32.05, lon: -52.10, factorRuta: 1.15 },
  { nombre: "Santos",          lat: -23.96, lon: -46.33, factorRuta: 1.10 },
  { nombre: "Salvador",        lat: -12.97, lon: -38.51, factorRuta: 1.10 },
  { nombre: "Ciudad del Cabo", lat: -33.92, lon:  18.42, factorRuta: 1.05 },
];

// velocidad en nudos (1 nudo = 1 milla náutica por hora)
// consumo en toneladas de combustible por DÍA navegando a velocidad nominal
// costoDiario en USD por cada día que el buque está ocupado (navegando o en puerto)
const FLOTA = [
  { nombre: "Bermejo",   capacidad:   750000, velocidad: 14.5, consumo: 38, costoDiario: 28000, calefaccionado: false },
  { nombre: "Paraná",    capacidad:  1000000, velocidad: 15.0, consumo: 50, costoDiario: 35000, calefaccionado: true  },
  { nombre: "Pilcomayo", capacidad:   750000, velocidad: 13.0, consumo: 42, costoDiario: 25000, calefaccionado: false },
  { nombre: "Iguazú",    capacidad:  2000000, velocidad: 15.5, consumo: 75, costoDiario: 60000, calefaccionado: true  },
];

// plazo: días desde el día 0 para que la descarga esté TERMINADA en destino
const PEDIDOS = [
  { id: "P1", destino: "Montevideo",      crudo: "Medanito",  barriles:  900000, plazo:  5 },
  { id: "P2", destino: "Santos",          crudo: "Escalante", barriles: 1200000, plazo:  9 },
  { id: "P3", destino: "Rio Grande",      crudo: "Medanito",  barriles:  400000, plazo:  4 },
  { id: "P4", destino: "Ciudad del Cabo", crudo: "Medanito",  barriles: 1500000, plazo: 16 },
  { id: "P5", destino: "Salvador",        crudo: "Escalante", barriles:  800000, plazo: 12 },
  { id: "P6", destino: "Santos",          crudo: "Medanito",  barriles:  700000, plazo: 10 },
  { id: "P7", destino: "Montevideo",      crudo: "Medanito",  barriles:  -50000, plazo:  6 },
  { id: "P8", destino: "Lagos",           crudo: "Medanito",  barriles:  600000, plazo: 20 },
];

const CONSTANTES = {
  RADIO_TIERRA_MN: 3440.065,     // radio terrestre en millas náuticas
  DIAS_CARGA: 1,                 // días de carga en Puerto Rosales por viaje
  DIAS_DESCARGA: 1,              // días de descarga en destino por viaje
  PRECIO_COMBUSTIBLE: 620,       // USD por tonelada
  EXTRA_CALEFACCION: 8,          // t/día extra al navegar CARGADO con crudo pesado
  VALOR_BARRIL: 70,              // USD por barril
  MULTA_DIARIA: 0.015,           // 1,5 % del valor de lo entregado tarde, por día (o fracción) de atraso
};

// ============================================================
//  TU SOLUCIÓN — escribí debajo de esta línea
// ============================================================

// PARTE 1 — Distancias
//   distanciaMN(a, b), distanciaRuta(nombreDestino)

// PARTE 2 — Modelo
//   class PedidoInvalidoError, class Buque, class BuqueCalefaccionado

// PARTE 3 — Planificación
//   planificar(flota, pedidos)

// PARTE 4 — Informe
//   reportar(...)

// PARTE 5 — Simulación
//   esperar(ms), simularBuque(buque, inicio), simular(flota)

// MAIN
//   const flota = FLOTA.map(...)
//   planificar, reportar, simular(...)
//   console.log("planificación terminada");
