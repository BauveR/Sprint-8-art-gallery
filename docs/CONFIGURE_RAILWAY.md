# Configurar Firebase en Railway

## 🚨 PROBLEMA ACTUAL

El error `500 Internal Server Error` indica que **Firebase Admin SDK no tiene credenciales** en Railway.

Railway necesita las credenciales de Firebase para poder asignar el rol de admin. Actualmente estás usando `FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json` localmente, pero ese archivo **no existe en Railway**.

---

## ✅ SOLUCIÓN: Configurar variables de entorno en Railway

Necesitas agregar 3 variables de entorno en Railway con los datos del service account:

### **Opción 1: Desde Railway Dashboard (RECOMENDADO)** 🖥️

1. Ve a https://railway.app/project/reasonable-beauty
2. Selecciona el servicio **API**
3. Ve a **Variables**
4. Agrega estas 3 variables:

#### Variable 1: FIREBASE_PROJECT_ID
```
FIREBASE_PROJECT_ID
```
Valor:
```
artgallery-e079a
```

#### Variable 2: FIREBASE_CLIENT_EMAIL
```
FIREBASE_CLIENT_EMAIL
```
Valor:
```
firebase-adminsdk-fbsvc@artgallery-e079a.iam.gserviceaccount.com
```

#### Variable 3: FIREBASE_PRIVATE_KEY
```
FIREBASE_PRIVATE_KEY
```
Valor (copia TODO esto, incluyendo las líneas BEGIN y END):
```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDfELC/jHQydSdb
0KCIW2UbKOmW13LpGLjS61fppomDHf1YldHdCwaEnyqK9Vmt7u1I6iAT6zziKDtX
5NSk1hARw4PhGhqJfp/fIn5dtKyUPL717ZZkRaE9+9jXIqTdslY7qgsJecXHtBLv
/zC6PhDcF5hotG8AS6J6HOrywE/mbs7wqLEzmIbAxjGuT+cq28SkLcyAesTVsnub
MTpLdpZQ3prZl+u4fQMSVCfff8A5QgMfWzeo8sJp5KwTBHhi6nJCwDkfqBpr94/M
Xecbh0u3xXuFMtprWVhrImW/UfGTzRoBti98HI47pvR6P4Mzp//7e9SQO/Z3geHW
jPzMj4hnAgMBAAECggEAPsKMaChVXQj3PO7y68qDJOQa7LTLgOfSwI00m+meUQS0
DiOA+2cpu1CpAJXNWJGbs2MkCVarN5pIMA+TAJm1xbmztjbI9pxo0Lf8w9Kcp8x7
kef541Zv6mecd9MofbO6bWkHV/AqBGkW1u1+wTfLOJFu8S6q+HNPUHooZIpVMKi/
2kxbGTppS+jjoJQDvbHOSynZcOCKE4ANzvBQaMArGtx1QaYCpMLr6xke51MTB5zl
SykPvpc00FuvFIt+SwYJyS01ftiKy9xdDCfBbirPxbs6FfTbEJ6RPxOERbPK+IN5
92tjsJ+jKgTtLJ6N9buXxxRCbj6P8fn5K5RVEn5RuQKBgQD+AXSEMv1J0UM4Ydb7
omD6yYK7rHvrcsvocRQvqIc8qPJDPjpEEZiKOrEzrXfoMv1IqEwB1v5O8QlO1IQ4
ZxtCZzEF0fYdRrzoxRZomJ+sbtbcM51/eNu8TPfgzEy5XlZUC6uJ4zTGI2eePvz9
Y8UPtRLXau/VEFycX90/9rSbqwKBgQDg0QuzFQzFXYzy3TbJt3fU2bVRPO2bOpSy
6purT4cu9qKwIJprX1ekHgajYvh/XjjjD1uV2BQH2jOviwT+UiIPltJYm6a4ZuyW
DjIwRzrJMSZFObDGbXaEZUuOuGchoTx7svcDj7lJ0GmN4iF8TDv+sNdl7qbNPzCO
gvPej6PqNQKBgQCVWzWwJmtZZHsqRB2tiSWNUcBVqm6TW8UawKMmAurCeHU7pPON
4urXHPvlbzL6jkDw4EURL+IJeSIIAF5e7AHTYeopifQ18spR9NHgXx5EvkgI4zDR
K7fJWVjIDllvBlGsyc/sHHWDrH3ZRyBrvqa5Pbf+gxrTJfPO32+xlNdOUQKBgDJZ
33ruXfveJfFG5jxrYOVFFTzqnnTDvAYOUWse1rIH/wvfYXZm1iQlrWrugaVVHvyL
tgFrcaEIl8bbJfUnxAUlzFqYEdD/DEHXUBpL+biRz3Z1o0ftwDuKzE9csYxwpjE2
NeiQSflkOh/S45kJIe67AKMNvkH9wwxH/AJ+vUF5AoGAT1JrwkrQOYGPD5p4v65S
l9KSI2y6wtpY+XAkkDCx/NnwWoucNDig5aJJnZiARPfh2AHs9bWYMnfzmYgVYlCX
Y25OmptZGb6RUZNiOs3dHs7RfdsgiMT8ydVU5w4mQIBi+R1dyS4z4e/1LNdLiO3+
QkVOYCLC5oxGd2tNqZDi0lA=
-----END PRIVATE KEY-----
```

**⚠️ IMPORTANTE:**
- Copia la private key **EXACTAMENTE** como está, incluyendo los saltos de línea
- No agregues espacios ni comillas extra
- Verifica que empiece con `-----BEGIN PRIVATE KEY-----` y termine con `-----END PRIVATE KEY-----`

5. **Guarda los cambios**
6. **Espera 1-2 minutos** para que Railway reinicie el servicio

---

### **Opción 2: Usando Railway CLI** 💻

Si prefieres usar la terminal:

```bash
cd /Users/rick/Documents/Academy/Sprint-8-art-gallery

# Vincular proyecto
railway link

# Configurar variables
railway variables --set "FIREBASE_PROJECT_ID=artgallery-e079a"
railway variables --set "FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@artgallery-e079a.iam.gserviceaccount.com"
railway variables --set "FIREBASE_PRIVATE_KEY=$(cat api/firebase-service-account.json | grep -o '"private_key": "[^"]*' | cut -d'"' -f4)"
```

---

## ✅ Después de configurar las variables

1. **Espera 1-2 minutos** para que Railway reinicie con las nuevas variables
2. **Verifica el deployment** en Railway Dashboard (debe estar en verde)
3. **Ejecuta el script nuevamente** desde la consola del navegador:

```javascript
(async function setupAdmin() {
  console.log('🚀 Iniciando configuración de admin...');

  const SECRET = 'change-me-in-production';
  const EMAIL = 'admin@gallery.com';
  const API_URL = 'https://sprint-8-art-gallery-production.up.railway.app';

  try {
    console.log(`📤 Enviando petición...`);

    const response = await fetch(`${API_URL}/api/admin-setup/set-admin-role`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, secret: SECRET })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Admin role asignado exitosamente!');
      console.log('📋 Respuesta:', data);
      console.log('\n⚠️  CIERRA SESIÓN Y VUELVE A INICIAR SESIÓN\n');
      return data;
    } else {
      console.error('❌ Error:', data);
      return data;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return error;
  }
})();
```

---

## 🧪 Verificar que las variables están configuradas

Puedes verificar que las variables estén configuradas correctamente ejecutando:

```bash
railway variables
```

Deberías ver:
```
FIREBASE_PROJECT_ID=artgallery-e079a
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@...
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
ADMIN_SETUP_SECRET=piedra-admin-setup-2024
```

---

## 📋 Resumen de variables necesarias en Railway

| Variable | Valor |
|----------|-------|
| `FIREBASE_PROJECT_ID` | `artgallery-e079a` |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-fbsvc@artgallery-e079a.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----` |
| `ADMIN_SETUP_SECRET` | `piedra-admin-setup-2024` (ya configurado) |

---

## ⚠️ Seguridad

Estas credenciales son **sensibles** y deben mantenerse **privadas**:
- ✅ Están en Railway (privado)
- ✅ Están en `.env` local (gitignored)
- ❌ NO están en el repositorio público
- ❌ NO están en el frontend

---

¿Ya agregaste las variables en Railway? Una vez que lo hagas, espera 1-2 minutos y ejecuta el script nuevamente. 🚀
