// ============================================================
//  SIMULACRO PARCIAL 1 — Programación IV — UTN FRRe
//  Datos del problema: "PetroSur S.A."
//  NO modificar este bloque. Copialo al principio de tu archivo.
// ============================================================

const PUERTO_ORIGEN = "Puerto Rosales";

// Coordenadas en grados decimales (latitud negativa = sur, longitud negativa = oeste).
// factorRuta: la ruta real por mar es más larga que la línea recta (hay costa que rodear).
const PUERTOS = [
  { nombre: "Puerto Rosales", lat: -38.93, lon: -62.07, factorRuta: 1.0 },
  { nombre: "Montevideo", lat: -34.9, lon: -56.21, factorRuta: 1.25 },
  { nombre: "Rio Grande", lat: -32.05, lon: -52.1, factorRuta: 1.15 },
  { nombre: "Santos", lat: -23.96, lon: -46.33, factorRuta: 1.1 },
  { nombre: "Salvador", lat: -12.97, lon: -38.51, factorRuta: 1.1 },
  { nombre: "Ciudad del Cabo", lat: -33.92, lon: 18.42, factorRuta: 1.05 },
];

// velocidad en nudos (1 nudo = 1 milla náutica por hora)
// consumo en toneladas de combustible por DÍA navegando a velocidad nominal
// costoDiario en USD por cada día que el buque está ocupado (navegando o en puerto)
const FLOTA = [
  {
    nombre: "Bermejo",
    capacidad: 750000,
    velocidad: 14.5,
    consumo: 38,
    costoDiario: 28000,
    calefaccionado: false,
  },
  {
    nombre: "Paraná",
    capacidad: 1000000,
    velocidad: 15.0,
    consumo: 50,
    costoDiario: 35000,
    calefaccionado: true,
  },
  {
    nombre: "Pilcomayo",
    capacidad: 750000,
    velocidad: 13.0,
    consumo: 42,
    costoDiario: 25000,
    calefaccionado: false,
  },
  {
    nombre: "Iguazú",
    capacidad: 2000000,
    velocidad: 15.5,
    consumo: 75,
    costoDiario: 60000,
    calefaccionado: true,
  },
];

// plazo: días desde el día 0 para que la descarga esté TERMINADA en destino
const PEDIDOS = [
  {
    id: "P1",
    destino: "Montevideo",
    crudo: "Medanito",
    barriles: 900000,
    plazo: 5,
  },
  {
    id: "P2",
    destino: "Santos",
    crudo: "Escalante",
    barriles: 1200000,
    plazo: 9,
  },
  {
    id: "P3",
    destino: "Rio Grande",
    crudo: "Medanito",
    barriles: 400000,
    plazo: 4,
  },
  {
    id: "P4",
    destino: "Ciudad del Cabo",
    crudo: "Medanito",
    barriles: 1500000,
    plazo: 16,
  },
  {
    id: "P5",
    destino: "Salvador",
    crudo: "Escalante",
    barriles: 800000,
    plazo: 12,
  },
  {
    id: "P6",
    destino: "Santos",
    crudo: "Medanito",
    barriles: 700000,
    plazo: 10,
  },
  {
    id: "P7",
    destino: "Montevideo",
    crudo: "Medanito",
    barriles: -50000,
    plazo: 6,
  },
  {
    id: "P8",
    destino: "Lagos",
    crudo: "Medanito",
    barriles: 600000,
    plazo: 20,
  },
];

const CONSTANTES = {
  RADIO_TIERRA_MN: 3440.065, // radio terrestre en millas náuticas
  DIAS_CARGA: 1, // días de carga en Puerto Rosales por viaje
  DIAS_DESCARGA: 1, // días de descarga en destino por viaje
  PRECIO_COMBUSTIBLE: 620, // USD por tonelada
  EXTRA_CALEFACCION: 8, // t/día extra al navegar CARGADO con crudo pesado
  VALOR_BARRIL: 70, // USD por barril
  MULTA_DIARIA: 0.015, // 1,5 % del valor de lo entregado tarde, por día (o fracción) de atraso
};

// ============================================================
//  TU SOLUCIÓN — escribí debajo de esta línea
// ============================================================

// PARTE 1 — Distancias
//   distanciaMN(a, b), distanciaRuta(nombreDestino)

//pasar de grados a radianes

const aRadianes = (grados) => (grados * Math.PI) / 180;

const calcularHaversine = (lat1, lon1, lat2, lon2) => {
  //diferencia de latitudes y longitudes
  const diferenciaLat = lat2 - lat1;
  const diferenciaLon = lon2 - lon1;

  const cambioLatitud = Math.sin(diferenciaLat / 2) ** 2;

  const cambioLongitud =
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(diferenciaLon / 2) ** 2;

  const haversine = cambioLatitud + cambioLongitud;

  return haversine;
};

// distancia millas nauticas entre dos puntos geográficos (lat/lon) usando la fórmula de Haversine
const distanciaMN = (a, b) => {
  const lat1 = aRadianes(a.lat);
  const lon1 = aRadianes(a.lon);
  const lat2 = aRadianes(b.lat);
  const lon2 = aRadianes(b.lon);

  const haversine = calcularHaversine(lat1, lon1, lat2, lon2);

  const angulo = 2 * Math.asin(Math.sqrt(haversine));

  const distancia = CONSTANTES.RADIO_TIERRA_MN * angulo;

  return distancia;
};

const distanciaRuta = (nombreDestino) => {
  const puertoOrigen = PUERTOS.find(
    (puerto) => puerto.nombre === PUERTO_ORIGEN,
  );

  const puertoDestino = PUERTOS.find(
    (puerto) => puerto.nombre === nombreDestino,
  );

  const distanciaOrtodromica = distanciaMN(puertoOrigen, puertoDestino);

  const distanciaRuta = distanciaOrtodromica * puertoDestino.factorRuta;

  return distanciaRuta;
};

const resultado = distanciaRuta("Montevideo");

// PARTE 2 — Modelo
//   class PedidoInvalidoError, class Buque, class BuqueCalefaccionado

// destructuracion de constantes
const {
  EXTRA_CALEFACCION,
  DIAS_CARGA,
  DIAS_DESCARGA,
  PRECIO_COMBUSTIBLE,
  VALOR_BARRIL,
  MULTA_DIARIA,
} = CONSTANTES;

class PedidoInvalidoError extends Error {
  constructor(msg) {
    super(msg);

    this.name = "PedidoInvalidoError";
  }
}

class Buque {
  #agenda = [];
  #disponibleDesde = 0;

  constructor({ nombre, capacidad, velocidad, consumo, costoDiario }) {
    if (capacidad <= 0) throw new Error("La capacidad debe ser positiva");

    if (velocidad <= 0) throw new Error("La velocidad debe ser positiva");

    this.capacidad = capacidad;
    this.consumo = consumo;
    this.costoDiario = costoDiario;
    this.nombre = nombre;
    this.velocidad = velocidad;
  }

  get agenda() {
    return [...this.#agenda];
  }

  get disponibleDesde() {
    return this.#disponibleDesde;
  }

  puedeTransportar(crudo) {
    return crudo === "Medanito";
  }

  consumoDiario(cargado, crudo) {
    return this.consumo;
  }

  cotizar(pedido, barriles) {
    const distancia = distanciaRuta(pedido.destino);

    const diasNavegacion = distancia / (this.velocidad * 24);

    const salida = this.#disponibleDesde;

    const finEntrega = salida + DIAS_CARGA + diasNavegacion + DIAS_DESCARGA;

    const regreso = finEntrega + diasNavegacion;

    const toneladasIda =
      diasNavegacion * this.consumoDiario(true, pedido.crudo);

    const toneladasVuelta =
      diasNavegacion * this.consumoDiario(false, pedido.crudo);

    const toneladas = toneladasIda + toneladasVuelta;

    const costoCombustible = toneladas * PRECIO_COMBUSTIBLE;

    const costoOperativo = (regreso - salida) * this.costoDiario;

    const costo = costoCombustible + costoOperativo;

    const diasAtraso = Math.ceil(Math.max(0, finEntrega - pedido.plazo));

    const multa = diasAtraso * barriles * VALOR_BARRIL * MULTA_DIARIA;

    return {
      pedido: pedido.id,
      destino: pedido.destino,
      crudo: pedido.crudo,
      barriles,
      salida,
      finEntrega,
      regreso,
      toneladas,
      costo,
      multa,
    };
  }

  registrar(cotizacion) {
    this.#agenda.push(cotizacion);
    this.#disponibleDesde = cotizacion.regreso;
  }
}

class BuqueCalefaccionado extends Buque {
  puedeTransportar(crudo) {
    return super.puedeTransportar(crudo) || crudo === "Escalante";
  }

  consumoDiario(cargado, crudo) {
    const consumoBase = super.consumoDiario(cargado, crudo);

    if (cargado && crudo === "Escalante") {
      return consumoBase + EXTRA_CALEFACCION;
    }

    return consumoBase;
  }
}

// PARTE 3 — Planificación
//   planificar(flota, pedidos)

const validarPedido = (pedido) => {
  if (!Number.isFinite(pedido.barriles) || pedido.barriles <= 0)
    throw new PedidoInvalidoError("Los barriles deben ser un numero positivo");

  if (!Number.isFinite(pedido.plazo) || pedido.plazo <= 0)
    throw new PedidoInvalidoError("El plazo debe ser un numero positivo");

  const destinoExiste = PUERTOS.some(
    (puerto) => puerto.nombre === pedido.destino,
  );

  if (!destinoExiste) throw new PedidoInvalidoError("El destino no existe");
};

const planificar = (flota, pedidos) => {
  const validos = [];

  const rechazados = [];

  for (const pedido of pedidos) {
    try {
      validarPedido(pedido);
      validos.push(pedido);
    } catch (error) {
      if (!(error instanceof PedidoInvalidoError)) throw error;

      rechazados.push({
        pedido: pedido.id,
        motivo: error.message,
      });
    }
  }

  validos.sort(
    (pedidoA, pedidoB) =>
      pedidoA.plazo - pedidoB.plazo || pedidoB.barriles - pedidoA.barriles,
  );

  for (const pedido of validos) {
    let barrilesFaltantes = pedido.barriles;

    while (barrilesFaltantes > 0) {
      const candidatos = flota.filter((buque) =>
        buque.puedeTransportar(pedido.crudo),
      );

      const opciones = candidatos.map((buque) => {
        const barrilesViaje = Math.min(buque.capacidad, barrilesFaltantes);

        return {
          buque,
          cotizacion: buque.cotizar(pedido, barrilesViaje),
        };
      });

      opciones.sort(
        (opcionA, opcionB) =>
          opcionA.cotizacion.finEntrega - opcionB.cotizacion.finEntrega ||
          opcionA.cotizacion.costo - opcionB.cotizacion.costo,
      );

      const mejorOpcion = opciones[0];

      mejorOpcion.buque.registrar(mejorOpcion.cotizacion);

      barrilesFaltantes -= mejorOpcion.cotizacion.barriles;
    }
  }

  return rechazados;
};

// Variante pedida en 7.2: para Medanito prioriza buques comunes que lleguen en plazo.
const planificarPriorizandoComunes = (flota, pedidos) => {
  const validos = [];
  const rechazados = [];

  for (const pedido of pedidos) {
    try {
      validarPedido(pedido);
      validos.push(pedido);
    } catch (error) {
      if (!(error instanceof PedidoInvalidoError)) throw error;
      rechazados.push({ pedido: pedido.id, motivo: error.message });
    }
  }

  validos.sort(
    (pedidoA, pedidoB) =>
      pedidoA.plazo - pedidoB.plazo || pedidoB.barriles - pedidoA.barriles,
  );

  for (const pedido of validos) {
    let barrilesFaltantes = pedido.barriles;

    while (barrilesFaltantes > 0) {
      let candidatos = flota.filter((buque) =>
        buque.puedeTransportar(pedido.crudo),
      );

      if (pedido.crudo === "Medanito") {
        const comunesEnPlazo = candidatos.filter(
          (buque) =>
            !(buque instanceof BuqueCalefaccionado) &&
            buque.cotizar(
              pedido,
              Math.min(buque.capacidad, barrilesFaltantes),
            ).finEntrega <= pedido.plazo,
        );

        if (comunesEnPlazo.length > 0) candidatos = comunesEnPlazo;
      }

      const opciones = candidatos.map((buque) => ({
        buque,
        cotizacion: buque.cotizar(
          pedido,
          Math.min(buque.capacidad, barrilesFaltantes),
        ),
      }));

      opciones.sort(
        (opcionA, opcionB) =>
          opcionA.cotizacion.finEntrega - opcionB.cotizacion.finEntrega ||
          opcionA.cotizacion.costo - opcionB.cotizacion.costo,
      );

      const mejorOpcion = opciones[0];
      mejorOpcion.buque.registrar(mejorOpcion.cotizacion);
      barrilesFaltantes -= mejorOpcion.cotizacion.barriles;
    }
  }

  return rechazados;
};

// PARTE 4 — Informe
//   reportar(...)

const reportar = (flota, pedidos, rechazados) => {
  console.log("PEDIDOS RECHAZADOS");
  console.table(rechazados);

  const viajes = flota.flatMap((buque) =>
    buque.agenda.map((viaje) => ({
      buque: buque.nombre,
      ...viaje,
    })),
  );

  console.log("VIAJES");
  console.table(
    viajes.map((viaje) => ({
      buque: viaje.buque,
      pedido: viaje.pedido,
      destino: viaje.destino,
      barriles: viaje.barriles,
      salida: viaje.salida.toFixed(2),
      finEntrega: viaje.finEntrega.toFixed(2),
      regreso: viaje.regreso.toFixed(2),
      toneladas: viaje.toneladas.toFixed(2),
      costo: viaje.costo.toFixed(2),
      multa: viaje.multa.toFixed(2),
    })),
  );

  const idsRechazados = new Set(rechazados.map(({ pedido }) => pedido));
  const pedidosValidos = pedidos.filter(
    (pedido) => !idsRechazados.has(pedido.id),
  );

  console.log("PEDIDOS");
  console.table(
    pedidosValidos.map((pedido) => {
      const viajesDelPedido = viajes.filter(
        (viaje) => viaje.pedido === pedido.id,
      );
      const entregaCompleta = Math.max(
        ...viajesDelPedido.map((viaje) => viaje.finEntrega),
      );
      const multaTotal = viajesDelPedido.reduce(
        (total, viaje) => total + viaje.multa,
        0,
      );

      return {
        pedido: pedido.id,
        plazo: pedido.plazo.toFixed(2),
        entregaCompleta: entregaCompleta.toFixed(2),
        viajes: viajesDelPedido.length,
        estado: entregaCompleta <= pedido.plazo ? "EN PLAZO" : "ATRASADO",
        multa: multaTotal.toFixed(2),
      };
    }),
  );

  const horizonte = Math.max(...viajes.map((viaje) => viaje.regreso));

  console.log("FLOTA");
  console.table(
    flota.map((buque) => {
      const diasOcupado = buque.agenda.reduce(
        (total, viaje) => total + viaje.regreso - viaje.salida,
        0,
      );

      return {
        buque: buque.nombre,
        viajes: buque.agenda.length,
        diasOcupado: diasOcupado.toFixed(2),
        utilizacion: `${((diasOcupado / horizonte) * 100).toFixed(2)}%`,
      };
    }),
  );

  const barrilesEntregados = viajes.reduce(
    (total, viaje) => total + viaje.barriles,
    0,
  );
  const costoLogistico = viajes.reduce(
    (total, viaje) => total + viaje.costo,
    0,
  );
  const multas = viajes.reduce((total, viaje) => total + viaje.multa, 0);
  const costoTotal = costoLogistico + multas;

  console.log("TOTALES");
  console.table([
    {
      barrilesEntregados,
      costoLogistico: costoLogistico.toFixed(2),
      multas: multas.toFixed(2),
      costoTotal: costoTotal.toFixed(2),
      costoPorBarril: (costoTotal / barrilesEntregados).toFixed(2),
    },
  ]);
};

// PARTE 5 — Simulación
//   esperar(ms), simularBuque(buque, inicio), simular(flota)
const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const bitacora = [];

const simularBuque = async (buque, inicio) => {
  for (const viaje of buque.agenda) {
    const eventos = [
      {
        dia: viaje.salida + DIAS_CARGA,
        mensaje: `${buque.nombre} zarpa hacia ${viaje.destino}`,
      },
      {
        dia: viaje.finEntrega,
        mensaje: `${buque.nombre} termina de descargar en ${viaje.destino}`,
      },
      {
        dia: viaje.regreso,
        mensaje: `${buque.nombre} vuelve a Puerto Rosales`,
      },
    ];

    for (const evento of eventos) {
      const tiempoObjetivo = evento.dia * 40;
      const tiempoTranscurrido = Date.now() - inicio;
      const tiempoRestante = Math.max(0, tiempoObjetivo - tiempoTranscurrido);

      await esperar(tiempoRestante);

      bitacora.push(evento);
      console.log(`[dia ${evento.dia.toFixed(2)}] ${evento.mensaje}`);
    }
  }

  return buque.nombre;
};

const simular = async (flota) => {
  bitacora.length = 0;
  const inicio = Date.now();
  const buquesFinalizados = await Promise.all(
    flota.map((buque) => simularBuque(buque, inicio)),
  );

  console.log(`Buques finalizados: ${buquesFinalizados.join(", ")}`);

  const estaOrdenada = bitacora.every(
    (evento, indice) => indice === 0 || bitacora[indice - 1].dia <= evento.dia,
  );

  console.log(`Bitacora cronologica: ${estaOrdenada ? "SI" : "NO"}`);
};

// MAIN
//   const flota = FLOTA.map(...)
//   planificar, reportar, simular(...)
//   console.log("planificación terminada");

const flota = FLOTA.map((datosBuque) =>
  datosBuque.calefaccionado
    ? new BuqueCalefaccionado(datosBuque)
    : new Buque(datosBuque),
);

const rechazados = planificar(flota, PEDIDOS);

reportar(flota, PEDIDOS, rechazados);

const resumirOperacion = (flota) => {
  const viajes = flota.flatMap((buque) => buque.agenda);
  const costoLogistico = viajes.reduce(
    (total, viaje) => total + viaje.costo,
    0,
  );
  const multas = viajes.reduce((total, viaje) => total + viaje.multa, 0);

  return {
    costoLogistico: costoLogistico.toFixed(2),
    multas: multas.toFixed(2),
    costoTotal: (costoLogistico + multas).toFixed(2),
  };
};

const flotaVariante = FLOTA.map((datosBuque) =>
  datosBuque.calefaccionado
    ? new BuqueCalefaccionado(datosBuque)
    : new Buque(datosBuque),
);

planificarPriorizandoComunes(flotaVariante, PEDIDOS);

console.log("COMPARACION DE ESTRATEGIAS");
console.table([
  { estrategia: "Original", ...resumirOperacion(flota) },
  { estrategia: "Priorizar comunes", ...resumirOperacion(flotaVariante) },
]);

simular(flota);
console.log("planificación terminada");
