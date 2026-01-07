
export const cargarImagen = async (url) => {
    const urlAlternativa = process.env.REACT_APP_API_URL + '\\' + url;
    const resultado = await obtenerImagenValida(url, urlAlternativa);
    return resultado;
}


/**
 * Verifica si una imagen existe en una URL.
 * @param {string} url - URL de la imagen a verificar.
 * @returns {Promise<boolean>} - true si la imagen existe, false si no.
 */
const verificarImagen = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    // Verifica que la respuesta sea exitosa y que el tipo de contenido sea imagen
    return response.ok && response.headers.get('content-type')?.startsWith('image');
  } catch (error) {
    return false;
  }
}

/**
 * Retorna la URL de la imagen válida entre la principal y la alternativa.
 * @param {string} urlPrincipal - URL de la imagen principal.
 * @param {string} urlAlternativa - URL de la imagen alternativa.
 * @returns {Promise<string|null>} - URL válida o null si ninguna existe.
 */
export const obtenerImagenValida = async (urlPrincipal, urlAlternativa) => {
  if (await verificarImagen(urlPrincipal)) {
    return urlPrincipal;
  } else if (await verificarImagen(urlAlternativa)) {
    return urlAlternativa;
  } else {
    return null;
  }
}
