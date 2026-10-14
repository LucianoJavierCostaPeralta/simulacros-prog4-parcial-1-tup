// ============================================================
//  PARCIAL 1 — Programación IV — UTN FRRe
//  Datos del problema: "Red de Drones Sanitarios del Chaco"
//  NO modificar este bloque.
// ============================================================

// Plano cartesiano en KILÓMETROS con origen en el Hospital Perrando (Resistencia).
// x positivo = este, y positivo = norte.
const BASE = { nombre: "Hospital Perrando", x: 0, y: 0 };

const PUESTOS = [
  { nombre: "Fontana", x: -6, y: 1 },
  { nombre: "Puerto Tirol", x: -17, y: 4 },
  { nombre: "Colonia Benítez", x: -3, y: 16 },
  { nombre: "Margarita Belén", x: -6, y: 27 },
  { nombre: "Basail", x: -10, y: -38 },
  { nombre: "Las Palmas", x: 5, y: 58 },
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
  {
    nombre: "Yaguareté",
    velocidadAire: 60,
    capacidad: 5,
    bateria: 900,
    potenciaBase: 450,
    potenciaPorKg: 30,
    refrigerado: false,
  },
  {
    nombre: "Tatú",
    velocidadAire: 45,
    capacidad: 8,
    bateria: 1200,
    potenciaBase: 600,
    potenciaPorKg: 35,
    refrigerado: false,
  },
  {
    nombre: "Carpincho",
    velocidadAire: 50,
    capacidad: 6,
    bateria: 1100,
    potenciaBase: 500,
    potenciaPorKg: 30,
    refrigerado: true,
  },
];

// prioridad: 1 = urgente, 3 = puede esperar
// plazo: MINUTOS desde el inicio de la operación para que la carga esté entregada
const MISIONES = [
  {
    id: "M1",
    destino: "Colonia Benítez",
    insumo: "medicamentos",
    kg: 4,
    prioridad: 1,
    plazo: 40,
  },
  {
    id: "M2",
    destino: "Puerto Tirol",
    insumo: "vacunas",
    kg: 10,
    prioridad: 1,
    plazo: 90,
  },
  {
    id: "M3",
    destino: "Fontana",
    insumo: "medicamentos",
    kg: 12,
    prioridad: 2,
    plazo: 90,
  },
  {
    id: "M4",
    destino: "Margarita Belén",
    insumo: "vacunas",
    kg: 5,
    prioridad: 2,
    plazo: 240,
  },
  {
    id: "M5",
    destino: "Basail",
    insumo: "medicamentos",
    kg: 3,
    prioridad: 1,
    plazo: 100,
  },
  {
    id: "M6",
    destino: "Las Palmas",
    insumo: "medicamentos",
    kg: 2,
    prioridad: 3,
    plazo: 180,
  },
  {
    id: "M7",
    destino: "Fontana",
    insumo: "medicamentos",
    kg: -2,
    prioridad: 2,
    plazo: 60,
  },
  {
    id: "M8",
    destino: "Corrientes",
    insumo: "medicamentos",
    kg: 3,
    prioridad: 1,
    plazo: 30,
  },
];

const CONSTANTES = {
  RESERVA: 0.2, // nunca se usa el último 20 % de la batería
  PREPARACION_MIN: 10, // minutos de carga en el hospital antes de cada despegue
  ENTREGA_MIN: 5, // minutos de descarga en el puesto
  POTENCIA_CARGADOR: 600, // W: la recarga tarda (Wh consumidos / 600) horas
  EXTRA_FRIO: 60, // W extra del refrigerado mientras vuela CON vacunas
};

// ============================================================
//  TU SOLUCIÓN — escribí debajo de esta línea
// ============================================================

// PARTE 1 — distancia(a, b), velocidadSuelo(vAire, desde, hasta, viento)

const distancia = (origen, destino) =>
  Math.hypot(destino.x - origen.x, destino.y - origen.y);

const velocidadSuelo = (velocidadAire, origen, destino, viento) => {
  const distanciaRecorrido = distancia(origen, destino);

  if (distanciaRecorrido === 0) return velocidadAire;

  const direccionX = (destino.x - origen.x) / distanciaRecorrido;
  const direccionY = (destino.y - origen.y) / distanciaRecorrido;

  const aporteViento = viento.x * direccionX + viento.y * direccionY;

  return velocidadAire + aporteViento;
};

// PARTE 2 — ErrorDeMision, MisionInvalidaError, MisionImposibleError, Dron, DronRefrigerado

class ErrorDeMision extends Error {
  constructor(mensaje) {
    super(mensaje);

    this.name = new.target.name;
  }
}

class MisionInvalidaError extends ErrorDeMision {}

class MisionImposibleError extends ErrorDeMision {}

class Dron {
  constructor({
    nombre,
    velocidadAire,
    capacidad,
    bateria,
    potenciaBase,
    potenciaPorKg,
  }) {
    this.nombre = nombre;
    this.velocidadAire = velocidadAire;
    this.capacidad = capacidad;
    this.bateria = bateria;
    this.potenciaBase = potenciaBase;
    this.potenciaPorKg = potenciaPorKg;
    this.disponibleDesde = 0;
  }

  calcularPotencia(kg) {
    return this.potenciaBase + this.potenciaPorKg * kg;
  }

  calcularTrayecto(destino, viento) {
    const distanciaKm = distancia(BASE, destino);

    const velocidadIda = velocidadSuelo(
      this.velocidadAire,
      BASE,
      destino,
      viento,
    );

    const velocidadVuelta = velocidadSuelo(
      this.velocidadAire,
      destino,
      BASE,
      viento,
    );

    if (velocidadIda <= 0 || velocidadVuelta <= 0) {
      throw new MisionImposibleError(
        `${this.nombre} no puede volar debido al viento`,
      );
    }

    return {
      distanciaKm,
      velocidadIda,
      velocidadVuelta,
      horaIda: distanciaKm / velocidadIda,
      horaVuelta: distanciaKm / velocidadVuelta,
    };
  }

  calcularConsumo(destino, kg, insumo, viento) {
    const trayecto = this.calcularTrayecto(destino, viento);

    const potenciaIda = this.calcularPotencia(kg, insumo);
    const potenciaVuelta = this.calcularPotencia(0);

    const energiaIda = potenciaIda * trayecto.horaIda;
    const energiaVuelta = potenciaVuelta * trayecto.horaVuelta;
    const energiaTotal = energiaIda + energiaVuelta;

    const bateriaDisponible = this.bateria * (1 - CONSTANTES.RESERVA);

    return {
      ...trayecto,
      potenciaIda,
      potenciaVuelta,
      energiaIda,
      energiaVuelta,
      energiaTotal,
      bateriaDisponible,
      bateriaSuficiente: energiaTotal <= bateriaDisponible,
    };
  }

  dividirCarga(kgTotal) {
    const cantidadVuelos = Math.ceil(kgTotal / this.capacidad);

    return Array.from({ length: cantidadVuelos }, (_, indice) =>
      Math.min(this.capacidad, kgTotal - indice * this.capacidad),
    );
  }

  calcularVuelo(destino, kg, insumo, viento) {
    const consumo = this.calcularConsumo(destino, kg, insumo, viento);

    if (!consumo.bateriaSuficiente)
      throw new MisionImposibleError(
        `${this.nombre} no tiene bateria suficiente`,
      );

    const minutosIda = consumo.horaIda * 60;
    const minutosVuelta = consumo.horaVuelta * 60;

    const entregaMin =
      CONSTANTES.PREPARACION_MIN + minutosIda + CONSTANTES.ENTREGA_MIN;

    const regresoBaseMin = entregaMin + minutosVuelta;

    const recargaMin =
      (consumo.energiaTotal / CONSTANTES.POTENCIA_CARGADOR) * 60;

    return {
      dron: this.nombre,
      kg,
      insumo,
      distanciaKm: consumo.distanciaKm,
      minutosIda,
      minutosVuelta,
      entregaMin,
      regresoBaseMin,
      recargaMin,
      energiaWh: consumo.energiaTotal,
    };
  }

  programarVuelo(mision, kg, viento) {
    const inicioMin = this.disponibleDesde;

    const vuelo = this.calcularVuelo(mision.puesto, kg, mision.insumo, viento);

    const entregaMin = inicioMin + vuelo.entregaMin;

    const regresoBaseMin = inicioMin + vuelo.regresoBaseMin;

    const disponibleNuevamenteMin = regresoBaseMin + vuelo.recargaMin;

    this.disponibleDesde = disponibleNuevamenteMin;

    return {
      ...vuelo,
      mision: mision.id,
      destino: mision.destino,
      inicioMin,
      entregaMin,
      regresoBaseMin,
      disponibleNuevamenteMin,
      cumplePlazo: entregaMin <= mision.plazo,
    };
  }
}

class DronRefrigerado extends Dron {
  calcularPotencia(kg, insumo) {
    const potenciaNormal = super.calcularPotencia(kg);

    const requiereRefrigeracion = insumo === "vacunas" && kg > 0;

    return requiereRefrigeracion
      ? potenciaNormal + CONSTANTES.EXTRA_FRIO
      : potenciaNormal;
  }
}

// PARTE 3 — planificar(flota, misiones)

const crearDron = (datosDron) =>
  datosDron.refrigerado ? new DronRefrigerado(datosDron) : new Dron(datosDron);

const validarMision = (mision) => {
  if (mision.kg <= 0)
    throw new MisionInvalidaError(
      `${mision.id}: los kilogramos deben ser mayor a cero `,
    );

  const puesto = PUESTOS.find(({ nombre }) => nombre === mision.destino);

  if (!puesto)
    throw new MisionInvalidaError(
      `${mision.id}: el destino ${mision.destino} no existe`,
    );

  return {
    ...mision,
    puesto,
  };
};

const planificar = (flota, misiones) => {
  const drones = flota.map(crearDron);
  const vuelos = [];

  const resultadoValidacion = misiones.reduce(
    (resultado, mision) => {
      try {
        resultado.misionesValidas.push(validarMision(mision));
      } catch (error) {
        if (!(error instanceof ErrorDeMision)) throw error;

        resultado.errores.push(error);
      }
      return resultado;
    },
    { misionesValidas: [], errores: [] },
  );

  const { misionesValidas, errores } = resultadoValidacion;

  misionesValidas.sort(
    (misionA, misionB) =>
      misionA.prioridad - misionB.prioridad || misionA.plazo - misionB.plazo,
  );

  const obtenerDronesCompatibles = ({ insumo }) =>
    drones.filter(
      (dron) =>
        insumo !== "vacunas" || dron instanceof DronRefrigerado,
    );

  const compatibilidad = misionesValidas.map((mision) => ({
    mision: mision.id,
    drones: obtenerDronesCompatibles(mision).map(({ nombre }) => nombre),
  }));

  misionesValidas.forEach((mision) => {
    const dron = obtenerDronesCompatibles(mision).sort(
      (dronA, dronB) => dronA.disponibleDesde - dronB.disponibleDesde,
    )[0];

    if (!dron) {
      errores.push(
        new MisionImposibleError(`${mision.id}: no hay drones compatibles`),
      );
      return;
    }

    const disponibilidadAnterior = dron.disponibleDesde;

    try {
      const vuelosMision = dron
        .dividirCarga(mision.kg)
        .map((carga) => dron.programarVuelo(mision, carga, VIENTO));

      if (vuelosMision.some(({ cumplePlazo }) => !cumplePlazo))
        throw new MisionImposibleError(`${mision.id}: no cumple el plazo`);

      vuelos.push(...vuelosMision);
    } catch (error) {
      dron.disponibleDesde = disponibilidadAnterior;

      if (!(error instanceof ErrorDeMision)) throw error;

      errores.push(
        error.message.startsWith(`${mision.id}:`)
          ? error
          : new MisionImposibleError(`${mision.id}: ${error.message}`),
      );
    }
  });

  return {
    compatibilidad,
    drones,
    misionesValidas,
    vuelos,
    errores,
  };
};

// PARTE 4 — reportar(...)

const redondear = (numero) => Number(numero.toFixed(2));

const reportar = ({ misionesValidas, compatibilidad, vuelos, errores }) => {
  console.log("\nPARTE 3 — PLANIFICACIÓN");
  console.table(
    misionesValidas.map((mision) => ({
      mision: mision.id,
      destino: mision.destino,
      prioridad: mision.prioridad,
      plazoMin: mision.plazo,
      dronesCompatibles: compatibilidad
        .find(({ mision: id }) => id === mision.id)
        .drones.join(", "),
    })),
  );

  console.log("\nPARTE 4 — VUELOS PROGRAMADOS");
  console.table(
    vuelos.map((vuelo) => ({
      mision: vuelo.mision,
      dron: vuelo.dron,
      destino: vuelo.destino,
      kg: vuelo.kg,
      inicioMin: redondear(vuelo.inicioMin),
      entregaMin: redondear(vuelo.entregaMin),
      energiaWh: redondear(vuelo.energiaWh),
    })),
  );

  console.log("\nERRORES");
  errores.forEach(({ name, message }) => console.log(`${name}: ${message}`));
};

// MAIN

const resultadoPlanificacion = planificar(FLOTA, MISIONES);
reportar(resultadoPlanificacion);
