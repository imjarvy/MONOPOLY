export async function enviarResultado(datosPartida) {
    try {
        const response = await fetch('http://127.0.0.1:5000/scores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosPartida)
        });
        
        if (!response.ok) {
            throw new Error('Error enviando resultado');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error en scoreService:', error);
        throw error;
    }
}