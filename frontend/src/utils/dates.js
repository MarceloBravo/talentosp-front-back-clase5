export const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

export const formatDateDMY = (dateString) => {
    if(!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

}

export const segundosAHMS = (segundos) => {
  const horas = Math.floor(segundos / 3600);
  const minutos = Math.floor((segundos % 3600) / 60);
  const segundosRestantes = segundos % 60;

  // Opcional: añadir ceros a la izquierda
  const h = String(horas).padStart(2, '0');
  const m = String(minutos).padStart(2, '0');
  const s = String(segundosRestantes).padStart(2, '0');

  return `${h}:${m}:${s}`;
}
