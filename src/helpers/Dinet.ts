export function validateDinetCamp(cad: string) {
    let cadena = cad;

    cadena = cadena.replace(/,/g, "-");
    cadena = cadena.replace(/;/g, "-");
    cadena = cadena.replace(/ñ/g, "n");
    cadena = cadena.replace(/Ñ/g, "n");
    cadena = cadena.replace(/á/g, "a");
    cadena = cadena.replace(/é/g, "e");
    cadena = cadena.replace(/í/g, "i");
    cadena = cadena.replace(/ó/g, "o");
    cadena = cadena.replace(/ú/g, "u");
    cadena = cadena.replace(/Á/g, "A");
    cadena = cadena.replace(/É/g, "E");
    cadena = cadena.replace(/Í/g, "I");
    cadena = cadena.replace(/Ó/g, "O");
    cadena = cadena.replace(/Ú/g, "U");

    return cadena;
}

export function getDinetDate(date: Date = new Date()) {
    const strDate = date.toLocaleDateString();

    let [month, day, year] = strDate.split("/");

    month = month.length === 1 ? `0${month}` : month;
    day = day.length === 1 ? `0${day}` : day;

    return `${day}/${month}/${year}`;
    // return `${day}/06/2024`;
}
