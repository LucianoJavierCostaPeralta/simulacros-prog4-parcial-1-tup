// ============================================================
//  PARCIAL 1 — Programación IV — UTN FRRe
//  Datos del problema: "Red de Drones Sanitarios del Chaco"
//  NO modificar este bloque.
// ============================================================

// Plano cartesiano en KILÓMETROS con origen en el Hospital Perrando (Resistencia).
// x positivo = este, y positivo = norte.
const BASE = { nombre: "Hospital Perrando", x: 0, y: 0 };

const PUESTOS = [
  { nombre: "Fontana",          x:  -6, y:   1 },
  { nombre: "Puerto Tirol",     x: -17, y:   4 },
  { nombre: "Colonia Benítez",  x:  -3, y:  16 },
  { nombre: "Margarita Belén",  x:  -6, y:  27 },
  { nombre: "Basail",           x: -10, y: -38 },
  { nombre: "Las Palmas",       x:   5, y:  58 },
];

// Viento: vector en km/h. Indica HACIA DÓNDE sopla.
// { x: 10, y: 15 } = sopla hacia el noreste (viene del suroeste).
const VIENTO = { x: 10, y: 15 };

// velocidadAire: km/h respecto del aire (lo que el dron "cree" que vuela)
// capacidad: kg máximos por vuelo
// bateria: Wh (vatios-hora)
// potenciaBase: W que consume volando vacío
// potenciaPorKg: W extra por cada kg de carga
const FLOTA = [
  { nombre: "Yaguareté", velocidadAire: 60, capacidad: 5, bateria:  900, potenciaBase: 450, potenciaPorKg: 30, refrigerado: false },
  { nombre: "Tatú",      velocidadAire: 45, capacidad: 8, bateria: 1200, potenciaBase: 600, potenciaPorKg: 35, refrigerado: false },
  { nombre: "Carpincho", velocidadAire: 50, capacidad: 6, bateria: 1100, potenciaBase: 500, potenciaPorKg: 30, refrigerado: true  },
];

// prioridad: 1 = urgente, 3 = puede esperar
// plazo: MINUTOS desde el inicio de la operación para que la carga esté entregada
const MISIONES = [
  { id: "M1", destino: "Colonia Benítez", insumo: "medicamentos", kg:  4, prioridad: 1, plazo:  40 },
  { id: "M2", destino: "Puerto Tirol",    insumo: "vacunas",      kg: 10, prioridad: 1, plazo:  90 },
  { id: "M3", destino: "Fontana",         insumo: "medicamentos", kg: 12, prioridad: 2, plazo:  90 },
  { id: "M4", destino: "Margarita Belén", insumo: "vacunas",      kg:  5, prioridad: 2, plazo: 240 },
  { id: "M5", destino: "Basail",          insumo: "medicamentos", kg:  3, prioridad: 1, plazo: 100 },
  { id: "M6", destino: "Las Palmas",      insumo: "medicamentos", kg:  2, prioridad: 3, plazo: 180 },
  { id: "M7", destino: "Fontana",         insumo: "medicamentos", kg: -2, prioridad: 2, plazo:  60 },
  { id: "M8", destino: "Corrientes",      insumo: "medicamentos", kg:  3, prioridad: 1, plazo:  30 },
];

const CONSTANTES = {
  RESERVA: 0.20,            // nunca se usa el último 20 % de la batería
  PREPARACION_MIN: 10,      // minutos de carga en el hospital antes de cada despegue
  ENTREGA_MIN: 5,           // minutos de descarga en el puesto
  POTENCIA_CARGADOR: 600,   // W: la recarga tarda (Wh consumidos / 600) horas
  EXTRA_FRIO: 60,           // W extra del refrigerado mientras vuela CON vacunas
};

// ============================================================
//  TU SOLUCIÓN — escribí debajo de esta línea
// ============================================================

// PARTE 1 — distancia(a, b), velocidadSuelo(vAire, desde, hasta, viento)
// PARTE 2 — ErrorDeMision, MisionInvalidaError, MisionImposibleError, Dron, DronRefrigerado
// PARTE 3 — planificar(flota, misiones)
// PARTE 4 — reportar(...)
// MAIN
