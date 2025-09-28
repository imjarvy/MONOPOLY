export async function obtenerBandera(codigoPais) {
    return `https://flagsapi.com/${codigoPais.toUpperCase()}/flat/64.png`;
}