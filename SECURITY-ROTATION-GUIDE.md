# 🔒 Guía de Rotación de Claves de Seguridad

## ⚠️ Situación
Las claves de Firebase fueron expuestas en el historial de Git del repositorio. Aunque se removieron del código y del historial, es una buena práctica rotarlas por seguridad.

---

## 🔥 Rotar Claves de Firebase

### Opción 1: Crear un Nuevo Proyecto Firebase (Recomendado)

Esta es la forma más segura si las claves estuvieron expuestas públicamente.

#### Pasos:

1. **Ve a [Firebase Console](https://console.firebase.google.com)**

2. **Crea un nuevo proyecto:**
   - Click en "Add project"
   - Nombre: `artgallery-prod` (o el que prefieras)
   - Sigue los pasos de configuración

3. **Configura Authentication:**
   - Ve a Authentication → Get Started
   - Habilita Email/Password
   - Habilita Google Sign-In
   - En Settings → Authorized domains, agrega:
     - `localhost`
     - Tu dominio de Vercel (ej: `sprint-8-art-gallery.vercel.app`)

4. **Obtén las nuevas credenciales del cliente:**
   - Ve a Project Settings (⚙️) → General
   - Scroll hasta "Your apps"
   - Si no tienes app web, click en "Add app" → Web (</>)
   - Copia las credenciales del `firebaseConfig`

5. **Genera nuevo Service Account para el backend:**
   - Ve a Project Settings → Service Accounts
   - Click en "Generate new private key"
   - Se descargará un archivo JSON
   - Guárdalo como `firebase-service-account.json` en la carpeta `api/`

6. **Actualiza variables de entorno:**

   **En Vercel (Frontend):**
   ```bash
   VITE_FIREBASE_API_KEY=nueva_api_key
   VITE_FIREBASE_AUTH_DOMAIN=nuevo-proyecto.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=nuevo-proyecto-id
   VITE_FIREBASE_STORAGE_BUCKET=nuevo-proyecto.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=nuevo_sender_id
   VITE_FIREBASE_APP_ID=nuevo_app_id
   ```

   **En Railway (Backend):**
   ```bash
   FIREBASE_PROJECT_ID=nuevo-proyecto-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@nuevo-proyecto.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   ```

7. **Redeploy:**
   - Vercel se redesplegará automáticamente
   - Railway también se redesplegará al cambiar las variables

8. **⚠️ IMPORTANTE: Migración de usuarios**
   - Los usuarios del proyecto antiguo NO se transferirán automáticamente
   - Opciones:
     - Usar [Firebase Auth Import](https://firebase.google.com/docs/auth/admin/import-users)
     - O pedir a los usuarios que se registren nuevamente

---

### Opción 2: Restringir API Keys del Proyecto Actual (Más Rápido)

Si prefieres mantener el mismo proyecto pero mejorar la seguridad:

#### Para Firebase API Key (Cliente):

1. **Ve a [Google Cloud Console](https://console.cloud.google.com)**
2. Selecciona tu proyecto: `artgallery-e079a`
3. Ve a APIs & Services → Credentials
4. Encuentra tu API Key actual
5. Click en ella para editarla
6. **Restricciones de aplicación:**
   - Selecciona "HTTP referrers (web sites)"
   - Agrega:
     ```
     http://localhost:5173/*
     https://sprint-8-art-gallery.vercel.app/*
     https://*.vercel.app/*
     ```
7. **Restricciones de API:**
   - Selecciona "Restrict key"
   - Marca solo:
     - Identity Toolkit API
     - Token Service API
     - Firebase Storage API (si usas Storage)
8. Click en "Save"

#### Para Firebase Admin SDK:

1. **Ve a [Firebase Console](https://console.firebase.google.com)**
2. Selecciona tu proyecto: `artgallery-e079a`
3. Ve a Project Settings → Service Accounts
4. **Revoca las claves antiguas:**
   - Ve a "Manage service account permissions"
   - Esto te llevará a Google Cloud Console
   - Ve a IAM & Admin → Service Accounts
   - Encuentra `firebase-adminsdk`
   - Click en los 3 puntos → "Manage keys"
   - Elimina las keys antiguas
5. **Genera una nueva key:**
   - Click en "Add Key" → "Create new key"
   - Formato: JSON
   - Descarga y reemplaza `firebase-service-account.json`
6. **Actualiza Railway:**
   - Copia los valores del nuevo JSON
   - Actualiza `FIREBASE_PRIVATE_KEY` en Railway
   - Railway se redesplegará automáticamente

---

## 🔐 Stripe Keys (Opcional)

Si también quieres rotar las claves de Stripe:

1. **Ve a [Stripe Dashboard](https://dashboard.stripe.com)**
2. Ve a Developers → API keys
3. Click en "+ Create secret key" (para producción)
4. **Para test keys:**
   - En modo test, click en "Roll key"
   - Confirma que quieres crear una nueva key
5. **Actualiza las variables:**
   - `STRIPE_SECRET_KEY` en Railway (backend)
   - `VITE_STRIPE_PUBLIC_KEY` en Vercel (frontend)

---

## ✅ Verificación Final

Después de rotar las claves:

- [ ] El login con email/password funciona
- [ ] El login con Google funciona
- [ ] Los pagos con Stripe funcionan
- [ ] Las imágenes se cargan correctamente
- [ ] No hay errores en la consola del navegador
- [ ] No hay errores en los logs de Railway

---

## 🛡️ Mejores Prácticas para el Futuro

### Para evitar exponer claves nuevamente:

1. **NUNCA commits archivos con claves reales:**
   - `.env`
   - `.env.local`
   - `.env.production`
   - `firebase-service-account.json`
   - Cualquier archivo con credenciales

2. **Usa `.gitignore` correctamente:**
   - Verifica que estos archivos estén listados
   - Revisa con: `git check-ignore -v .env`

3. **Usa archivos .example:**
   - `.env.example` con placeholders
   - `.env.production.example` para documentación
   - DEPLOYMENT.md con placeholders (✅ ya corregido)

4. **Configura GitHub Secrets Scanning:**
   - Ve a Settings → Code security and analysis
   - Habilita "Secret scanning"
   - Habilita "Push protection"

5. **Revisa antes de commitear:**
   ```bash
   git diff --cached  # Ver cambios antes de commit
   ```

6. **Usa pre-commit hooks:**
   ```bash
   # Instalar detect-secrets
   pip install detect-secrets

   # Agregar hook
   detect-secrets-hook --baseline .secrets.baseline
   ```

---

## 📞 Recursos

- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firebase Auth Import Users](https://firebase.google.com/docs/auth/admin/import-users)
- [Google Cloud API Keys Best Practices](https://cloud.google.com/docs/authentication/api-keys)
- [Stripe Key Management](https://stripe.com/docs/keys)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

## ❓ FAQ

### ¿Qué tan grave es esta exposición?

- **Firebase API Key (cliente)**: Severidad MEDIA
  - Esta key está diseñada para ser pública en apps web
  - Sin embargo, sin restricciones, puede ser abusada
  - Riesgo: Requests no autorizados que consuman tu cuota

- **Firebase Admin SDK Key**: Severidad ALTA
  - Esta key tiene acceso administrativo
  - Si fue expuesta, DEBES rotarla inmediatamente

### ¿GitHub cerrará la alerta automáticamente?

Sí, una vez que:
1. Las claves se removieron del código (✅ hecho)
2. Se hizo force push para limpiar el historial (✅ hecho)
3. GitHub detecta que las keys ya no están presentes

Esto puede tomar 24-48 horas. Puedes cerrar la alerta manualmente en GitHub si ya rotaste las keys.

### ¿Necesito notificar a mis usuarios?

- Si rotaste a un nuevo proyecto Firebase: SÍ, los usuarios deberán registrarse nuevamente
- Si solo restringiste las keys: NO, todo seguirá funcionando normalmente

---

**¿Necesitas ayuda?** Revisa la documentación oficial de Firebase o abre un issue.
