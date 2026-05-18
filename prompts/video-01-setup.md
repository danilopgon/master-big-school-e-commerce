# Video 1: Setup + Primer Componente (15 min)

## Resultado Final
Proyecto React funcionando con ProductCard testeado.

---

## Paso 1: Crear Proyecto

```bash
pnpm create vite@latest simple-product-shop --template react-ts
cd simple-product-shop
pnpm install
pnpm install -D tailwindcss @tailwindcss/vite
```

---

## Paso 2: Configurar Tailwind

**Prompt para la IA:**
```
Estoy configurando un proyecto Vite con React y TypeScript.
Necesito integrar Tailwind CSS v4.

Requisitos:
- Usar el plugin @tailwindcss/vite
- Configurar el archivo vite.config.ts
- Actualizar src/index.css con el import de Tailwind

Dame los archivos modificados.
```

---

## Paso 3: Configurar Testing

```bash
pnpm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8
```

**Prompt para la IA:**
```
Necesito configurar Vitest para testing de componentes React.

Requisitos:
- Usar jsdom como environment
- Configurar setupFiles para jest-dom
- Agregar scripts en package.json: "test", "test:run", "test:coverage"

El proyecto usa Vite + React + TypeScript.
```

**Verificar**:
```bash
pnpm test
```

---

## Paso 3.1: Configurar tsconfig para Build (IMPORTANTE)

**Prompt para la IA:**
```
Necesito excluir los archivos de test del build de producción en TypeScript.

El problema: cuando hago pnpm build, TSC intenta compilar archivos .test.ts 
y .test.tsx que usan globals de Vitest (describe, it, expect).

Modifica tsconfig.app.json para excluir estos archivos del build.
```

---

## Paso 4: Estructura de Carpetas (The Scope Rule)

### Concepto: La Regla del Scope

Organizamos el código siguiendo el mismo concepto de **scope** de JavaScript:

```javascript
// Global Scope - disponible en toda la app
let globalVariable = 'Available everywhere';

// Local Scope - solo disponible en su contexto
function localContext() {
  let localVariable = 'Available only here';
}
```

**Aplicado a la arquitectura:**

| Tipo | Ubicación | Visibilidad | Ejemplos |
|------|-----------|-------------|----------|
| **Global Scope** | `src/shared/` | Toda la app | Button, Modal, formatPrice, types |
| **Local Scope** | `src/features/X/` | Solo en feature X | ProductCard, CartItem, CartService |

**Beneficios:**
- 🧩 **Modularidad**: Cada feature es independiente
- ♻️ **Reuso eficiente**: Componentes globales sin redundancia
- ⚡ **Lazy loading**: Features locales se cargan solo cuando se necesitan
- 🔍 **Claridad**: Sabes dónde buscar cada cosa

---

**Prompt para la IA:**
```
Crea la estructura de carpetas para una aplicación e-commerce 
siguiendo la "Scope Rule":

GLOBAL SCOPE (src/shared/) - Disponible en toda la app:
- types/       → Tipos TypeScript compartidos
- utils/       → Funciones de utilidad (formatPrice, etc.)
- constants/   → Constantes de negocio
- components/  → Componentes UI genéricos (Button, Modal, Skeleton)
- hooks/       → Custom hooks reutilizables

LOCAL SCOPE (src/features/) - Específico de cada funcionalidad:
- product-catalog/
  - components/   → ProductCard, ProductCatalog
- shopping-cart/
  - components/   → CartItem, CartSummary, ShoppingCart

ESTADO GLOBAL:
- src/context/    → Contexts de React (CartContext)

INFRAESTRUCTURA:
- src/infrastructure/  → Servicios externos (Sentry, API clients)
- src/test/           → Configuración de tests

Crea archivos index.ts vacíos donde sea necesario para los exports.
```

### Estructura Resultante

```
src/
├── shared/                    # 🌍 GLOBAL SCOPE
│   ├── types/
│   │   └── index.ts          # Product, CartItem
│   ├── utils/
│   │   └── index.ts          # formatPrice, calculateSubtotal
│   ├── constants/
│   │   └── businessRules.ts  # Reglas de negocio
│   ├── components/
│   │   └── index.ts          # Button, Skeleton, Toast
│   └── hooks/
│       └── index.ts          # useLocalStorage, etc.
│
├── features/                  # 📦 LOCAL SCOPE
│   ├── product-catalog/
│   │   ├── components/
│   │   │   ├── ProductCard.tsx
│   │   │   └── ProductCard.test.tsx
│   │   └── ProductCatalog.tsx
│   │
│   └── shopping-cart/
│       ├── components/
│       │   ├── CartItem.tsx
│       │   └── CartSummary.tsx
│       └── ShoppingCart.tsx
│
├── context/                   # 🔄 ESTADO GLOBAL
│   └── CartContext.tsx
│
├── infrastructure/            # 🔧 SERVICIOS EXTERNOS
│   └── sentry.ts
│
└── test/                      # 🧪 CONFIG DE TESTS
    └── setup.ts
```

### Regla Simple para Decidir

> **¿Lo usa más de una feature?** → `shared/` (Global Scope)
> 
> **¿Solo lo usa una feature?** → `features/X/` (Local Scope)

---

## Paso 5: TDD - ProductCard

### 5.1 Test Primero (RED)

**Prompt para la IA:**
```
Voy a crear un componente ProductCard usando TDD.
El componente NO existe todavía - necesito el test primero.

Requisitos del componente:
- Recibe un producto con: id, name, price, image
- Recibe un callback onAddToCart
- Muestra el nombre del producto
- Muestra el precio formateado como $XX.XX
- Tiene un botón "Add to Cart" que llama onAddToCart con el producto

Ubicación del test: src/features/product-catalog/components/ProductCard.test.tsx

Genera SOLO el archivo de test. El componente lo implementaré después
de ver que el test falla.
```

**Ejecutar (debe fallar)**:
```bash
pnpm test ProductCard
```

### 5.2 Implementar (GREEN)

**Prompt para la IA:**
```
Tengo este test fallando para ProductCard:

[Pegar el contenido del test generado]

Implementa el componente ProductCard.tsx que pase todos los tests.

Ubicación: src/features/product-catalog/components/ProductCard.tsx

Requisitos adicionale
- Estilos con Tailwind (card con sombra, hover en botón)
- Código mínimo para pasar los tests, nada más
```

**Ejecutar (debe pasar)**:
```bash
pnpm test ProductCard
```

---

## Paso 6: Ver en Browser

**Prompt para la IA:**
```
Modifica App.tsx para mostrar un ProductCard de prueba.

Requisitos:
- Importar ProductCard
- Renderizar uno con datos hardcodeados (cualquier producto de ejemplo)
- El onAddToCart puede ser un console.log por ahora
```

**Verificar**:
```bash
pnpm dev
# Abrir http://localhost:5173
```

---

## Paso 7: Verificación Final

```bash
# Ejecutar TODOS estos comandos - todos deben pasar
pnpm test:run      # Tests unitarios
pnpm build         # Build exitoso (verifica que tsconfig excluye tests)
```

> ⚠️ **IMPORTANTE**: A partir de este video, SIEMPRE verificar con estos comandos antes de dar por completado cualquier feature.

---

## Checkpoint

Al final del video tienes:
- ✅ Proyecto Vite + React + TypeScript
- ✅ Tailwind CSS funcionando
- ✅ Vitest + Testing Library configurado
- ✅ tsconfig.app.json excluyendo archivos de test
- ✅ Estructura de carpetas lista
- ✅ ProductCard con tests pasando
- ✅ App mostrando el componente
- ✅ Build exitoso
