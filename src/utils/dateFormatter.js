export const formatSpanishDate = (isoString) => {
    if (!isoString) return "—";
    const date = new Date(isoString);
    // Ajustamos el huso horario para evitar que reste un día por la zona UTC
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
  
    const day = String(localDate.getDate()).padStart(2, '0');
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const month = monthNames[localDate.getMonth()];
    const year = localDate.getFullYear();
    
    return `${day} de ${month} de ${year}`;
  };