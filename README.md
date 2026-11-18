# PPAI 2026 - Grupo 8 - CU 28 Registrar recepción de bolsín (patrón Iterator)

| | |
|---|---|
| Lenguaje | Java 17+ (backend) y JavaScript (frontend) |
| Framework | Spring Boot 3.2.0 (backend) y React 18 + Vite + Material UI (frontend) |
| Tecnología | Web: API REST + SPA |
| Base de datos | SQL Server (autenticación de Windows) |
| Persistencia | JPA / Hibernate (Spring Data JPA) |

## Cómo correrlo
**Terminal 1 - backend**
```powershell
cd backend
mvn spring-boot:run
# plan B sin SQL Server:  mvn spring-boot:run "-Dspring-boot.run.profiles=h2"
```
**Terminal 2 - frontend** (requiere Node.js 18 o superior)
```powershell
cd frontend
npm install     # solo la primera vez
npm run dev
```
Abrir **http://localhost:3000**.

## Guion para la defensa
1. **Flujo principal:** en el menú, "Comenzar" (Registrar recepción de bolsín) → seleccionar el precinto 50001 → Ver contenido → "El contenido del bolsín es igual al registrado" → Registrar recepción → Confirmar. Con "Registrar otro bolsín" se ve que el 50001 ya no aparece, y en el menú el contador baja a 2.
2. **A1:** escribir un precinto que no existe (por ejemplo 99999) → "No se encuentra bolsín con el número de precinto ingresado".
3. **A2:** escribir una CM que no está en la lista (por ejemplo "Salta") → "No se encuentra bolsín con la CM de origen ingresada".
4. **A6:** en el diálogo, elegir "No confirmar" → se cancela y no se modifica nada.
5. Mostrar en SSMS los cambios de estado (las consultas están en PARTE3-explicacion.md).

Explicaciones por parte: PARTE1 (Iterator y entidades), PARTE2 (gestor y pantalla), PARTE3 (persistencia), PARTE4 (front), PARTE5 (front nuevo y control de consistencia con la entrega de diseño).

Capturas del front nuevo: carpeta `capturas/front-nuevo`.
