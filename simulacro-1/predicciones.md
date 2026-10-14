# Parte 6 — Predicción y diagnóstico

## 6.1

La primera línea produce `ReferenceError: Cannot access 'tarifaBase' before initialization`.
La declaración de `calcularFlete` está disponible por *hoisting*, pero `tarifaBase` está en
la zona muerta temporal de `let`. La ejecución se corta y nunca se imprime `tarifa`.

## 6.2

La salida es `A`, `E`, `D`, `C`, `B`. Primero corre el código sincrónico; después Node
vacía la cola de `process.nextTick`, luego las microtareas de promesas y finalmente el
temporizador de `setTimeout`.

## 6.3

Primero imprime `rutas recalculadas` y después `zarpó a los 500 ms` aproximadamente.
El `while` bloquea el hilo durante 500 ms: el temporizador vence a los 100 ms, pero su
callback no puede ejecutarse hasta que termine el código sincrónico.

## 6.4

Imprime `108` y `true`. `super.consumoDiario()` busca el método en el prototipo de
`Buque`, que fue reemplazado por una función que devuelve 100; la subclase suma 8.
La cadena de prototipos de `b` sigue incluyendo `Buque.prototype`.

## 6.5

Imprime `9999 500` y luego `["combustible", "#combustible"]`. Las dos asignaciones crean
propiedades públicas; ninguna modifica el campo privado `#combustible`, cuyo valor sigue
siendo 500. `Object.keys` solo muestra propiedades públicas enumerables.

## 6.6

Imprime `alta` y `true`. La clave `__proto__` hace que la mezcla escriba
`calefaccionado` en `Object.prototype`; por eso hasta `bermejo` hereda ese valor. En
PetroSur podría habilitar indebidamente a un buque común para transportar Escalante.
La corrección es aceptar solo claves conocidas y rechazar `__proto__`, `constructor` y
`prototype`; también conviene usar `Object.keys`, comprobar propiedades propias y crear
diccionarios con `Object.create(null)`.
