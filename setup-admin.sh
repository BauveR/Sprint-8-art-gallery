#!/bin/bash

# Script para configurar admin role en producción
# Ejecutar: bash setup-admin.sh

echo "🚀 Configurando admin role..."
echo ""

SECRET="piedra-admin-setup-2024"
EMAIL="rick.bauve@gmail.com"
API_URL="https://sprint-8-art-gallery-production.up.railway.app"

echo "📤 Enviando petición a Railway..."
echo "Email: $EMAIL"
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "$API_URL/api/admin-setup/set-admin-role" \
  -H "Content-Type: application/json" \
  -H "Origin: https://sprint-8-art-gallery.vercel.app" \
  -d "{\"email\":\"$EMAIL\",\"secret\":\"$SECRET\"}")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

echo "Status Code: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ ÉXITO! Admin role asignado"
    echo ""
    echo "Respuesta:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
    echo ""
    echo "⚠️  IMPORTANTE:"
    echo "1. Ve a https://sprint-8-art-gallery.vercel.app"
    echo "2. Cierra sesión"
    echo "3. Inicia sesión con: $EMAIL"
    echo "4. Intenta crear/editar una obra"
    echo ""

    # Verificar claims
    echo "🔍 Verificando custom claims..."
    VERIFY_RESPONSE=$(curl -s -H "Origin: https://sprint-8-art-gallery.vercel.app" "$API_URL/api/admin-setup/verify-claims/$EMAIL?secret=$SECRET")
    echo "$VERIFY_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$VERIFY_RESPONSE"

elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ ERROR: Secret incorrecto"
    echo ""
    echo "El secret en Railway no coincide con: $SECRET"
    echo ""
    echo "Verifica en Railway que ADMIN_SETUP_SECRET = piedra-admin-setup-2024"
    echo ""
    echo "Detalles:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"

elif [ "$HTTP_CODE" = "404" ]; then
    echo "❌ ERROR: Usuario no encontrado"
    echo ""
    echo "El email $EMAIL no está registrado en Firebase"
    echo ""
    echo "Solución:"
    echo "1. Ve a https://sprint-8-art-gallery.vercel.app"
    echo "2. Regístrate con el email: $EMAIL"
    echo "3. Vuelve a ejecutar este script"

else
    echo "❌ ERROR: Respuesta inesperada"
    echo ""
    echo "Detalles:"
    echo "$BODY"
fi

echo ""
