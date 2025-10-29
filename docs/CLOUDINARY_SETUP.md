# Configuración de Cloudinary para Almacenamiento de Imágenes

## ¿Por qué Cloudinary?

Las imágenes ahora se guardan en **Cloudinary** en lugar del sistema de archivos local porque:
- ✅ Railway elimina archivos en cada redeploy (almacenamiento efímero)
- ✅ Cloudinary ofrece 25GB gratis al mes
- ✅ CDN global incluido para carga rápida
- ✅ Optimización automática de imágenes
- ✅ Redimensionamiento y transformaciones automáticas

## Paso 1: Crear cuenta en Cloudinary

1. Ve a [https://cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Regístrate con tu email (es gratis)
3. Confirma tu email

## Paso 2: Obtener credenciales

1. Una vez dentro, ve al **Dashboard**
2. Encontrarás tus credenciales en la sección "Account Details":
   - **Cloud Name**: `dxxxxx` (ejemplo)
   - **API Key**: `123456789012345`
   - **API Secret**: `abc123xyz...` (haz clic en "Reveal" para verlo)

## Paso 3: Configurar variables de entorno

### En desarrollo local (`api/.env`):

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_API_KEY=tu_api_key_aqui
CLOUDINARY_API_SECRET=tu_api_secret_aqui
```

### En Railway:

1. Ve a tu proyecto en Railway
2. Selecciona el servicio del **backend**
3. Ve a la pestaña **Variables**
4. Agrega las siguientes variables:
   - `CLOUDINARY_CLOUD_NAME` → tu cloud name
   - `CLOUDINARY_API_KEY` → tu api key
   - `CLOUDINARY_API_SECRET` → tu api secret
5. Railway se redeployará automáticamente

## Paso 4: Verificar funcionamiento

1. **Localmente**:
   - Ejecuta `npm run dev` en la carpeta `api/`
   - Intenta subir una imagen desde el frontend
   - Deberías ver la imagen en tu dashboard de Cloudinary en la carpeta `art-gallery/obras`

2. **En Railway**:
   - Espera a que termine el deploy
   - Prueba subir una imagen desde tu app en producción
   - Verifica en Cloudinary que la imagen se subió correctamente

## Características implementadas

### Optimización automática
- Las imágenes se redimensionan a máximo 1200x1200px
- Se aplica compresión automática (`quality: auto:good`)
- Formato automático según el navegador (WebP cuando es posible)

### Organización
- Todas las imágenes se guardan en la carpeta: `art-gallery/obras/`
- URLs permanentes y seguras (HTTPS)

### Eliminación
- Al eliminar una imagen desde la app, también se elimina de Cloudinary
- Ahorro de espacio automático

## Límites del plan gratuito

- ✅ 25GB de almacenamiento
- ✅ 25GB de bandwidth/mes
- ✅ 25 créditos/mes (suficiente para ~25,000 transformaciones)
- ✅ Ilimitadas imágenes

Para uso normal de una galería de arte, esto es más que suficiente.

## Migración de imágenes existentes

Si tienes imágenes guardadas localmente en `api/uploads/`:

1. Las imágenes antiguas seguirán funcionando mientras estén en Railway
2. **Nuevas imágenes** se subirán automáticamente a Cloudinary
3. Para migrar las antiguas, necesitarías:
   - Descargarlas localmente
   - Re-subirlas a través del formulario de la aplicación
   - O crear un script de migración (puedo ayudarte con esto si lo necesitas)

## Troubleshooting

### Error: "Invalid API credentials"
- Verifica que copiaste correctamente las 3 variables
- Asegúrate de no tener espacios al inicio o final
- El API Secret debe incluirse completo

### Las imágenes no se ven
- Verifica que las URLs en la base de datos empiecen con `https://res.cloudinary.com/`
- Revisa la consola del navegador para ver errores de CORS
- Cloudinary tiene CORS habilitado por defecto, pero puedes verificarlo en Settings > Security

### Cuota excedida
- Revisa tu dashboard de Cloudinary
- El plan gratuito es generoso, pero si lo excedes considera:
  - Eliminar imágenes no usadas
  - Reducir el tamaño máximo de las imágenes
  - Upgrade al plan Pro ($89/mes) si realmente lo necesitas

## Soporte

Si tienes problemas:
1. Revisa los logs de Railway con `railway logs`
2. Verifica las variables de entorno
3. Consulta la [documentación de Cloudinary](https://cloudinary.com/documentation)
