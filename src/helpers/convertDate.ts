export const formatDate = (isoDate: string): string => {

    if (isoDate == null) {
        return '';
    }
    const date = new Date(isoDate);

    // Opciones de formato en español y UTC
    const options: Intl.DateTimeFormatOptions = {
        year: '2-digit',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit', 
        hour12: true,
        timeZone: 'UTC'  // Asegurarse de que la fecha esté en UTC
    };

    // Formatear la fecha utilizando toLocaleString con UTC
    const formattedDate = date.toLocaleString('es-PE', options);
    return formattedDate; // Retornar la fecha formateada
};

// Ejemplo de uso
const formattedDate = formatDate("2024-11-28T10:53:37.000Z");
// console.log(formattedDate); // "28-nov-24 10:53:37 AM"
