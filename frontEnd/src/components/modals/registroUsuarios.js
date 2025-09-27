// ============== INICIALIZACIÓN SEGURA DEL MODAL ==============

/**
 * Renderiza y muestra el modal de registro de usuarios
 */
function renderModal() {
    try {
        console.log('🔄 Renderizando modal de registro...');
        
        // ✅ VERIFICAR QUE BOOTSTRAP ESTÉ DISPONIBLE
        if (typeof bootstrap === 'undefined') {
            console.error('❌ Bootstrap no está cargado');
            return;
        }
        
        // ✅ VERIFICAR QUE EL ELEMENTO DEL MODAL EXISTA
        const modalElement = document.getElementById('registroModal');
        if (!modalElement) {
            console.error('❌ Elemento modal #registroModal no encontrado en el DOM');
            return;
        }
        
        // ✅ CREAR INSTANCIA DE MODAL BOOTSTRAP DE FORMA SEGURA
        let modal;
        try {
            modal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });
        } catch (error) {
            console.error('❌ Error al crear instancia del modal:', error);
            return;
        }
        
        // ✅ VERIFICAR QUE EL MODAL SE CREÓ CORRECTAMENTE
        if (!modal || typeof modal.show !== 'function') {
            console.error('❌ Modal no se inicializó correctamente');
            return;
        }
        
        // ✅ MOSTRAR EL MODAL DE FORMA SEGURA
        modal.show();
        console.log('✅ Modal mostrado correctamente');
        
        // Cargar países de forma asíncrona
        cargarPaisesEnModal();
        
    } catch (error) {
        console.error('❌ Error en renderModal:', error);
    }
}

// ============== CARGA DE PAÍSES ==============

/**
 * Carga los países en el modal de forma asíncrona
 */
async function cargarPaisesEnModal() {
    try {
        console.log('🌍 Cargando países en el modal...');
        
        // ✅ VERIFICAR QUE getCountries ESTÉ DISPONIBLE
        if (typeof window.getCountries !== 'function') {
            console.warn('⚠️ getCountries no disponible, usando países básicos');
            cargarPaisesFallback();
            return;
        }
        
        // Cargar países desde el servicio
        const paises = await window.getCountries();
        
        if (paises && paises.length > 0) {
            renderizarSelectPaises(paises);
            console.log('✅ Países cargados en el modal:', paises.length);
        } else {
            console.warn('⚠️ No se recibieron países, usando fallback');
            cargarPaisesFallback();
        }
        
    } catch (error) {
        console.error('❌ Error al cargar países:', error);
        cargarPaisesFallback();
    }
}

/**
 * Carga países básicos como fallback
 */
function cargarPaisesFallback() {
    const paisesFallback = [
        { code: 'co', name: 'Colombia' },
        { code: 'mx', name: 'México' },
        { code: 'ar', name: 'Argentina' },
        { code: 'es', name: 'España' },
        { code: 'cl', name: 'Chile' },
        { code: 'pe', name: 'Perú' }
    ];
    
    renderizarSelectPaises(paisesFallback);
}

/**
 * Renderiza el select de países
 */
function renderizarSelectPaises(paises) {
    const selectPais = document.getElementById('paisSelect');
    if (!selectPais) {
        console.error('❌ Select de países no encontrado');
        return;
    }
    
    // Limpiar opciones existentes
    selectPais.innerHTML = '<option value="">Selecciona tu país</option>';
    
    // Agregar países
    paises.forEach(pais => {
        const option = document.createElement('option');
        option.value = pais.code;
        option.textContent = pais.name;
        selectPais.appendChild(option);
    });
}

// ============== INICIALIZACIÓN ==============

/**
 * Inicializa el módulo de registro de usuarios
 */
function inicializarRegistroUsuarios() {
    console.log('🚀 Inicializando módulo de registro de usuarios');
    
    // Esperar a que el DOM esté completamente cargado
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('📋 DOM cargado, módulo listo');
        });
    } else {
        console.log('📋 DOM ya estaba cargado, módulo listo');
    }
}

// ============== EXPORTS GLOBALES ==============

// Exponer funciones necesarias globalmente
window.mostrarModalRegistroUsuarios = renderModal;
window.RegistroUsuarios = {
    mostrarModal: renderModal,
    cargarPaises: cargarPaisesEnModal
};

// Inicializar el módulo
inicializarRegistroUsuarios();