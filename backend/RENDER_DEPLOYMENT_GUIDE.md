# Guía de Deployment en Render

## Variables de Entorno Requeridas

Debes configurar las siguientes variables de entorno en el dashboard de Render:

| Variable | Valor | Notas |
|----------|-------|-------|
| `DB_HOST` | `[Tu host PostgreSQL en Render]` | Obtenlo de tu base de datos PostgreSQL en Render |
| `DB_PORT` | `5432` | Puerto estándar de PostgreSQL |
| `DB_USER` | `[Tu usuario DB]` | Usuario de la base de datos |
| `DB_PASSWORD` | `[Tu contraseña DB]` | Contraseña de la base de datos |
| `DB_NAME` | `taskflow` | Nombre de la base de datos |
| `FRONTEND_URL` | `https://tudominio.com` | **IMPORTANTE:** Configura con tu URL de frontend en producción |
| `TOKEN_SECRETS` | `[Tu valor]` | JWT secret para tokens |
| `REFRESHTOKEN_SECRETS` | `[Tu valor]` | JWT secret para refresh tokens |
| `EXPIRES_TIME_TOKEN` | `1800s` | Tiempo de expiración del token (30 min) |
| `EXPIRES_TIME_REFRESHTOKEN` | `19800s` | Tiempo de expiración del refresh token (5.5 horas) |
| `SALTROUNDS` | `10` | Rondas de hashing para bcrypt |
| `PORT` | `10000` | Puerto que Render asigna automáticamente |
| `NODE_ENV` | `production` | Indica que estamos en producción |

## Cambios Realizados

### 1. **CORS Configuration (app.js)**
- ✅ Ahora CORS acepta `FRONTEND_URL` si está configurada
- ✅ Si `FRONTEND_URL` no está configurada, usa wildcard `*` (temporal)
- ✅ Credentials solo se habilitan si `FRONTEND_URL` está definida

### 2. **Server Binding (app.js)**
- ❌ **Antes:** `app.listen(port, 'localhost')` - Solo acepta conexiones locales
- ✅ **Ahora:** `app.listen(port, '0.0.0.0')` - Acepta conexiones externas (NECESARIO en cloud)

### 3. **Error Handling (app.js)**
- ✅ Agregado manejador 404 para rutas no encontradas
- ✅ El middleware de errores global sigue funcionando

## Pasos para Deploy en Render

### 1. Crear un Web Service en Render
```
- Conectar repositorio Git
- Seleccionar rama: main
- Runtime: Node
- Build Command: npm install
- Start Command: node app.js
```

### 2. Configurar Variables de Entorno
En el panel de Render → Environment:
- Copiar cada variable de la tabla anterior
- Asegúrate de usar valores VÁLIDOS para producción

### 3. Verificar Base de Datos PostgreSQL
- La BD debe estar accesible desde Render
- Usar las credenciales correctas
- Confirmar que el `DB_HOST` sea correcto (no usar localhost)

### 4. Deploy
```
- Push a la rama main
- Render automáticamente hará build y deploy
- Monitorear los logs en tiempo real
```

## Troubleshooting

### Si sigue fallando:

1. **Revisar logs en Render:**
   - Panel → Logs → Ver salida en tiempo real
   - Buscar errores de conexión BD
   - Buscar errores de módulos faltantes

2. **Verificar BD:**
   ```bash
   psql -h [DB_HOST] -U [DB_USER] -d taskflow
   ```

3. **Variables de Entorno:**
   - Asegúrate de que todas estén configuradas
   - No dejes ninguna vacía
   - Ten cuidado con espacios en blanco

4. **Puerto:**
   - Render asigna un puerto automáticamente en `process.env.PORT`
   - No lo hardcodees a 3000

## Comandos Útiles

```bash
# Probar localmente antes de deploy
npm install
npm start

# Verificar que app.js inicie correctamente
node -c app.js
```

## Notas Importantes

⚠️ **FRONTEND_URL:** 
- Una vez que despliegues el frontend, configúralo con la URL real
- Ejemplo: `https://tuapp-frontend.onrender.com`
- Sin esto, CORS funcionará en wildcard (menos seguro)

⚠️ **NODE_ENV:**
- Configurarlo a `production` puede afectar el comportamiento
- Actualmente el servidor solo se inicia si `NODE_ENV` NO está definido
- Considera revisar esta lógica en app.js si lo necesitas

---

**Última actualización:** Enero 2026
**Cambios realizados en:** `backend/app.js`
