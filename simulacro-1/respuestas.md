# Parte 7 — Justificación escrita

## 7.1

El algoritmo es válido, pero no garantiza el óptimo global porque elige el próximo viaje
sin evaluar pedidos futuros. Para P1 asigna el Paraná calefaccionado y entrega en el día
3,29, apenas antes que un buque común. Después los únicos buques aptos para Escalante
quedan más exigidos: P2 termina el día 11,51 y suma USD 2.730.000 de multa; P5 termina
el día 22,04 y suma USD 9.240.000. El resultado total es USD 17.482.500 de multas y
USD 23.660.979,17 de costo. Una elección local rápida puede salir cara más adelante.

## 7.2

La propuesta no mejoró el resultado. La estrategia original produjo USD 6.178.479,17
de costo logístico, USD 17.482.500 de multas y USD 23.660.979,17 totales. Al priorizar
buques comunes para Medanito, los valores subieron a USD 6.333.553,34, USD 19.005.000
y USD 25.338.553,34. Reservar los calefaccionados ayuda a Escalante, pero ocupa antes
los buques comunes y retrasa pedidos posteriores de Medanito. La regla local traslada el
problema y aumenta el total en USD 1.677.574,17, así que el compañero no tenía razón.

## 7.3

El orden se obtiene usando un único instante inicial y calculando cada espera contra el
tiempo absoluto `evento.dia * 40`; la ejecución verificó `Bitacora cronologica: SI`.
`setTimeout` no garantiza una hora exacta: solo habilita el callback después del mínimo.
Si cada espera fuera relativa al evento anterior, sus retrasos se acumularían y mezclarían
mal los eventos de diferentes buques. Un cálculo sincrónico de 300 ms demoraría todos
los callbacks; al terminar, las esperas pendientes serían cero y se procesarían tarde,
aunque conservarían el orden previsto por la lógica de la simulación.

## 7.4 — Bonus

Para una distancia `d`, el tiempo es `d/v`; entonces el combustible es
`consumoNominal·(v/vNominal)^3·d/v`, proporcional a `v²`. A 10 nudos, la ida del Bermejo
a Santos tarda 5,52 días y consume 68,77 t, frente a 144,58 t nominales: ahorra 75,82 t
y USD 47.005,54 de combustible. Termina la entrega el día 6,52, antes del plazo 10.
Sin embargo, ocupa el buque 1,71 días extra, que cuestan USD 47.940,41; el costo total
aumenta USD 934,87. Por lo tanto, con estos valores no conviene reducir la velocidad.
