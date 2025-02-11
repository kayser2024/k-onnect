export const templateHTML = (numberDoc: string) => {

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Correo de prueba</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }
        .container {
          margin: 0 auto;
          padding: 20px;
        }
        h1 {
          color: #007BFF;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007BFF;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        
      </style>
    </head>
    <body>
        <!-- Content -->
      <div class="container">
        <h2>Hola,</h2>
        <p>Adjunto archivo con los siguientes incidentes de la GUIA: <strong>${numberDoc}</strong>.</p>
        <p>Saludos Cordiales.</p>
        <br/>


      </div>

        
    </body>
    </html>
    `;

    return html;
}


