# 📋 TABLERO.HTML - MONOPOLY WEB

**Archivo:** `frontEnd/src/components/tablero/tablero.html`  
**Responsabilidad:** Página principal del juego con tablero y controles

---

## 📄 CÓDIGO COMPLETO

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Monopoly</title>
    <link rel="stylesheet" href="./tablero.css">
    <link rel="stylesheet" href="../../styles/panelJugador.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <!-- Sistema Toast y Modal de Dados -->
    <link rel="stylesheet" href="../../components/toast/toast.css">
    <link rel="stylesheet" href="../../components/modals/dadosModal.css">
</head>
<body class="container">
    <div class="row gx-2 gy-2">
        <!-- Tablero principal -->
        <div class="col-lg-8 col-md-7 col-sm-12 mb-3">
            <div class="tablero"></div>
        </div>
        <!-- Panel lateral: jugadores y dados -->
        <div class="col-lg-4 col-md-5 col-sm-12">
            <div id="panel-jugadores"></div>
            <div id="area-dados"></div>
        </div>
    </div>
    
    <!-- Scripts del sistema Toast y Modal -->
    <script src="../../components/toast/toast.js"></script>
    <script src="../../components/modals/dadosModal.js"></script>

    <!-- ✅ AGREGAR: Cargar app.js ANTES que los scripts del juego -->
    <script type="module" src="../../app.js"></script>
        
    <!-- Scripts del juego -->
    <script type="module" src="./tablero.js"></script>
    <script type="module" src="./dados.js"></script>
</body>
</html>
```

---

## 🏗️ ESTRUCTURA DEL LAYOUT

### **Layout Responsivo (Bootstrap 4.6.2)**
```html
<div class="row gx-2 gy-2">
    <div class="col-lg-8 col-md-7 col-sm-12 mb-3">  <!-- 66% en desktop -->
        <div class="tablero"></div>
    </div>
    <div class="col-lg-4 col-md-5 col-sm-12">        <!-- 33% en desktop -->
        <div id="panel-jugadores"></div>
        <div id="area-dados"></div>
    </div>
</div>
```

### **Responsividad:**
- **Desktop (lg):** Tablero 66% | Panel 33%
- **Tablet (md):** Tablero 58% | Panel 42%  
- **Mobile (sm):** Elementos apilados 100% ancho

---

## 🎨 HOJAS DE ESTILO INCLUIDAS

### **Estilos del Juego:**
- `./tablero.css` - Estilos específicos del tablero
- `../../styles/panelJugador.css` - Estilos del panel de jugadores

### **Framework y Componentes:**
- `Bootstrap 4.6.2` - Framework CSS responsivo
- `../../components/toast/toast.css` - Sistema de notificaciones
- `../../components/modals/dadosModal.css` - Modal de dados

---

## 📜 SCRIPTS CARGADOS

### **Orden de Carga (CRÍTICO):**

#### **1. Sistema de UI (No módulos)**
```html
<script src="../../components/toast/toast.js"></script>
<script src="../../components/modals/dadosModal.js"></script>
```

#### **2. Enrutador Principal (Módulo)**
```html
<!-- ✅ AGREGADO: Cargar app.js ANTES que los scripts del juego -->
<script type="module" src="../../app.js"></script>
```

#### **3. Scripts del Juego (Módulos)**
```html
<script type="module" src="./tablero.js"></script>
<script type="module" src="./dados.js"></script>
```

---

## 🔄 FLUJO DE INICIALIZACIÓN

### **Secuencia de Ejecución:**
1. **DOM se carga** → Estilos aplicados
2. **Toast y Modal** → Sistema de UI disponible
3. **app.js** → Detecta página tablero → `inicializarTablero()` → `inicializarJuegoMonopoly()`
4. **tablero.js** → Renderiza tablero
5. **dados.js** → Botón de dados funcional
6. **✅ moverFichaActual()** → Funciona correctamente

---

## 🎯 CONTENEDORES IMPORTANTES

### **Tablero Principal:**
```html
<div class="tablero"></div>
```
- **Función:** Contenedor donde se renderiza el tablero de Monopoly
- **Poblado por:** `tablero.js`

### **Panel de Jugadores:**
```html
<div id="panel-jugadores"></div>
```
- **Función:** Muestra información de jugadores (dinero, propiedades, turno actual)
- **Poblado por:** `panelJugador.js` vía `gameController.js`

### **Área de Dados:**
```html
<div id="area-dados"></div>
```
- **Función:** Contenedor del botón de dados
- **Poblado por:** `dados.js`

---

## 🔧 CAMBIO CRÍTICO REALIZADO

### **Problema Original:**
```
Error: No hay jugadores inicializados
```

### **Solución Implementada:**
```html
<!-- ✅ AGREGADO: Cargar app.js ANTES que los scripts del juego -->
<script type="module" src="../../app.js"></script>
```

### **¿Por qué es importante este orden?**
- **app.js** ejecuta `inicializarJuegoMonopoly()` 
- **gameController** inicializa array `jugadores[]`
- **dados.js** puede usar `moverFichaActual()` exitosamente

---

## 📱 COMPATIBILIDAD

### **Navegadores:**
- ✅ Chrome/Edge (ES6 modules)
- ✅ Firefox (ES6 modules)
- ✅ Safari (ES6 modules)

### **Dispositivos:**
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (576px - 767px)

---

## 🚀 ESTADO ACTUAL

**✅ Funcional** - Página lista para uso con:
- Layout responsivo
- Scripts en orden correcto
- Inicialización apropiada
- Sistema de notificaciones integrado

**🎯 Resultado:** Tablero completamente funcional con arquitectura modular.