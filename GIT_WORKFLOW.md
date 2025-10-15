# 🔀 Git Workflow - Estrategia de Branching

## 📊 Resumen del Estado Actual

✅ **Build**: Funcional (4.15s)
✅ **Tests**: Pasando (backend + frontend)
✅ **TypeScript**: 0 errores
✅ **Commits pendientes**: 3 commits adelante de origin/main

---

## 🌳 Estructura de Branches

```
main (producción)
  ↓
develop (desarrollo estable)
  ↓
feature/* (nuevas características)
bugfix/* (correcciones)
hotfix/* (urgencias en producción)
```

### **Descripción de Branches**

| Branch | Propósito | Protección |
|--------|-----------|------------|
| `main` | Código en producción, siempre estable | ✅ Protegido |
| `develop` | Integración de features, pre-producción | ⚠️ Semi-protegido |
| `feature/*` | Desarrollo de nuevas características | ❌ No protegido |
| `bugfix/*` | Corrección de bugs en develop | ❌ No protegido |
| `hotfix/*` | Corrección urgente en producción | ❌ No protegido |

---

## 🚀 Flujo de Trabajo Recomendado

### 1️⃣ Trabajar en una Nueva Feature

```bash
# 1. Asegúrate de estar en develop actualizado
git checkout develop
git pull origin develop

# 2. Crea un branch para tu feature
git checkout -b feature/nombre-descriptivo

# 3. Trabaja en tu código y haz commits frecuentes
git add .
git commit -m "feat: descripción del cambio"

# 4. Push a tu branch (puedes hacerlo varias veces)
git push origin feature/nombre-descriptivo

# 5. Cuando esté listo, merge a develop
git checkout develop
git merge feature/nombre-descriptivo

# 6. Push develop actualizado
git push origin develop

# 7. (Opcional) Elimina el branch de feature
git branch -d feature/nombre-descriptivo
git push origin --delete feature/nombre-descriptivo
```

### 2️⃣ Corregir un Bug

```bash
# Desde develop
git checkout -b bugfix/descripcion-del-bug
# ... haces cambios ...
git commit -m "fix: descripción de la corrección"
git push origin bugfix/descripcion-del-bug

# Merge a develop
git checkout develop
git merge bugfix/descripcion-del-bug
git push origin develop
```

### 3️⃣ Hotfix en Producción (Urgente)

```bash
# Desde main
git checkout main
git checkout -b hotfix/descripcion-urgencia
# ... corriges el problema ...
git commit -m "hotfix: descripción"

# Merge a main Y develop
git checkout main
git merge hotfix/descripcion-urgencia
git push origin main

git checkout develop
git merge hotfix/descripcion-urgencia
git push origin develop

git branch -d hotfix/descripcion-urgencia
```

### 4️⃣ Release: Pasar de Develop a Main

```bash
# Solo cuando develop está estable y listo para producción
git checkout main
git merge develop
git tag -a v1.x.x -m "Release version 1.x.x"
git push origin main --tags
```

---

## 📝 Convenciones de Commits

Usa **Conventional Commits** para mensajes claros:

```bash
feat: nueva característica
fix: corrección de bug
refactor: refactorización de código
docs: cambios en documentación
test: añadir o modificar tests
style: cambios de formato (sin cambios de código)
chore: tareas de mantenimiento
perf: mejoras de rendimiento
```

### Ejemplos:
```bash
git commit -m "feat: add user authentication with Firebase"
git commit -m "fix: resolve cart total calculation error"
git commit -m "refactor: extract types to centralized location"
git commit -m "docs: update README with setup instructions"
```

---

## 🔄 Comandos Útiles

### Ver estado de branches
```bash
git branch -a                    # Ver todos los branches
git status                       # Estado actual
git log --oneline --graph --all # Ver historial visual
```

### Sincronizar con remoto
```bash
git fetch origin                 # Obtener cambios sin merge
git pull origin develop          # Obtener y merge develop
git push origin develop          # Subir cambios a develop
```

### Limpiar branches viejos
```bash
git branch -d feature/nombre     # Eliminar local
git push origin --delete feature/nombre  # Eliminar remoto
git fetch --prune               # Limpiar referencias obsoletas
```

### Deshacer cambios
```bash
git reset --soft HEAD~1         # Deshacer último commit (mantiene cambios)
git reset --hard HEAD~1         # Deshacer último commit (borra cambios)
git revert <commit-hash>        # Crear commit que deshace otro commit
```

---

## ✅ Checklist Antes de Merge

Antes de hacer merge a `develop` o `main`:

- [ ] ✅ Build pasa: `npm run build`
- [ ] ✅ Tests pasan: `npm run test`
- [ ] ✅ No hay errores TypeScript
- [ ] ✅ Código revisado y limpio
- [ ] ✅ Commits tienen mensajes descriptivos
- [ ] ✅ Documentación actualizada si es necesario

---

## 🎯 Estado Actual del Proyecto

```bash
# Commits pendientes de push a origin/main
git log origin/main..main --oneline
```

**Commits actuales adelante de origin:**
1. `af49640` - refactor: Reorganize folder structure
2. `edc272b` - refactor: Extract types and interfaces
3. `7926bce` - refactor: Complete separation of concerns

### ⚠️ Acción Recomendada

```bash
# Opción 1: Push directo a main (si estás seguro)
git push origin main

# Opción 2: Crear develop y trabajar ahí (RECOMENDADO)
git checkout -b develop
git push origin develop

# Luego trabajar en features desde develop
git checkout -b feature/nueva-funcionalidad
```

---

## 🛡️ Protección de Branches (Opcional en GitHub)

Para configurar en GitHub:
1. Ve a Settings → Branches
2. Add rule para `main`:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date

---

## 📚 Recursos

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
