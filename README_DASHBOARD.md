# Funcionalidad adicional: Dashboard inteligente

## Proyecto
Seguimiento de Retos

## 1. Descripción

Se desarrolló un Dashboard inteligente que permite visualizar y analizar el cumplimiento de los retos personales registrados en la aplicación.

La funcionalidad presenta estadísticas generales y gráficos de progreso semanal, utilizando la información almacenada en MySQL y consultada mediante la API de Django.

Es una funcionalidad adicional a las desarrolladas en las guías de clase.

## 2. Objetivo

Facilitar la interpretación del progreso de los retos mediante indicadores visuales que ayuden al usuario a identificar sus avances y las semanas que requieren mayor atención.

## 3. Funciones implementadas

### Estadísticas generales

El Dashboard muestra:

- Cantidad total de retos registrados.
- Cantidad de retos en curso.
- Promedio de cumplimiento semanal.
- Número de semanas cerradas en rojo.
- Número de semanas cerradas en amarillo.
- Número de semanas cerradas en verde.

### Gráfico de progreso semanal

Permite seleccionar un reto y visualizar los porcentajes registrados en sus semanas de seguimiento. Cada barra representa el avance de una semana.

Los colores corresponden al sistema de semáforo:

- **Rojo:** semana cerrada con cumplimiento inferior al 10 %.
- **Amarillo:** semana cerrada con cumplimiento entre 10 % y 99 %.
- **Verde:** semana cerrada con cumplimiento del 100 %.
- **Azul:** semana en curso.
- **Gris:** semana pendiente.

### Análisis automático

El Dashboard genera un mensaje de orientación dependiendo del cumplimiento promedio y de la presencia de semanas cerradas en rojo.

Los mensajes se calculan mediante reglas programadas; no utilizan inteligencia artificial generativa.

## 4. Cálculo del cumplimiento promedio

Se utiliza el porcentaje de las semanas que ya comenzaron, incluidas las semanas en curso y las semanas cerradas. Las semanas futuras se excluyen del promedio para evitar que sus valores de 0 % afecten el indicador.

**Fórmula:**

```text
Cumplimiento promedio =
  Suma de porcentajes de semanas iniciadas
  ----------------------------------------
         Cantidad de semanas iniciadas
```

El resultado se redondea al entero más cercano. Si no hay semanas iniciadas, se muestra 0 %.

## 5. Tecnologías utilizadas

- **Angular:** interfaz y componentes.
- **Ionic:** presentación compatible con web y Android.
- **TypeScript:** cálculos de estadísticas y gráficos.
- **Angular Signals:** actualización reactiva de la pantalla.
- **RxJS:** recepción de los datos del seguimiento.
- **Django REST Framework:** API de retos y tareas semanales.
- **MySQL:** almacenamiento de información.
- **Capacitor:** ejecución de la aplicación en Android.

## 6. Archivos creados

### `frontend/src/app/core/dashboard.ts`

Contiene las funciones para calcular las estadísticas generales y preparar los datos del gráfico semanal.

### `frontend/src/app/core/dashboard.spec.ts`

Contiene cinco pruebas automáticas de los cálculos del Dashboard.

### `frontend/src/app/paginas/dashboard.page.ts`

Implementa la pantalla con tarjetas de estadísticas, mensajes de análisis, selector de retos y gráficos.

## 7. Archivos modificados

### `frontend/src/app/app.routes.ts`

Se agregó la ruta `/dashboard` para acceder a la nueva pantalla.

### `frontend/src/app/paginas/retos-lista.page.ts`

Se agregó el botón **Dashboard** en la pantalla principal de retos.

## 8. Cambios en el backend

No fue necesario modificar el backend. La funcionalidad utiliza los datos que ya devuelve la API desarrollada en clase:

- `GET /api/retos/`
- `GET /api/tareas/`

Los cálculos adicionales se realizan en Angular.

## 9. Funcionamiento en la web

1. Iniciar Django y Angular.
2. Abrir `http://localhost:4200/retos`.
3. Presionar el botón **Dashboard**.
4. Revisar las estadísticas generales.
5. Seleccionar un reto.
6. Comprobar que cambien el nombre y los porcentajes del gráfico.

## 10. Funcionamiento en Android

1. Compilar el frontend con `npx ng build`.
2. Ejecutar `npx cap sync android`.
3. Abrir el proyecto en Android Studio con `npx cap open android`.
4. Ejecutar la aplicación en el emulador Pixel 7, con Django encendido.
5. Acceder al **Dashboard** desde **Mis retos**.
6. Seleccionar un reto.
7. Comprobar las estadísticas y los gráficos.

## 11. Pruebas realizadas

Se ejecutó:

```powershell
npx ng test --watch=false
```

**Resultado observado:** 6 archivos de pruebas aprobados, 18 pruebas aprobadas y 0 pruebas fallidas.

Cinco pruebas corresponden específicamente al Dashboard:

1. Conteo de retos.
2. Identificación de semanas rojas y otros estados.
3. Cálculo del promedio sin incluir semanas futuras.
4. Filtrado de semanas según el reto seleccionado.
5. Generación del mensaje de análisis.

## 12. Evidencias

Se conservarán capturas de:

- Dashboard funcionando en Chrome.
- Estadísticas generales calculadas.
- Gráfico del reto **Hacer ejercicio** con 30 % en la semana 8.
- Dashboard funcionando en Android Studio.
- Resultado de las 18 pruebas automáticas.

Estas evidencias se incorporarán al documento de entrega.

## 13. Aporte de la funcionalidad

El Dashboard complementa el seguimiento semanal porque reúne la información de los retos en una sola pantalla. Permite conocer el cumplimiento general, comparar el avance entre semanas e identificar oportunidades de mejora.

Su principal aporte consiste en transformar los datos de seguimiento en estadísticas y gráficos fáciles de interpretar.
