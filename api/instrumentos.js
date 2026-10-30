const { sql } = require('@vercel/postgres');

module.exports = async function handler(req, res) {
    try {
        // Crea la tabla automáticamente en la base de datos de Vercel si no existe
        await sql`
            CREATE TABLE IF NOT EXISTS instrumentos (
                id SERIAL PRIMARY KEY,
                persona VARCHAR(100) NOT NULL,
                instrumento VARCHAR(100) NOT NULL,
                nro_parte VARCHAR(100) NOT NULL,
                nro_serie VARCHAR(100) NOT NULL,
                foto TEXT
            );
        `;

        // READ - Obtener todos los instrumentos
        if (req.method === 'GET') {
            const { rows } = await sql`SELECT * FROM instrumentos ORDER BY id DESC;`;
            return res.status(200).json(rows);
        }

        // CREATE - Cargar nuevo instrumento
        if (req.method === 'POST') {
            const { persona, instrumento, nro_parte, nro_serie, foto } = req.body;
            await sql`
                INSERT INTO instrumentos (persona, instrumento, nro_parte, nro_serie, foto)
                VALUES (${persona}, ${instrumento}, ${nro_parte}, ${nro_serie}, ${foto});
            `;
            return res.status(201).json({ mensaje: 'Instrumento creado' });
        }

        // UPDATE - Modificar un instrumento existente
        if (req.method === 'PUT') {
            const { id, persona, instrumento, nro_parte, nro_serie, foto } = req.body;
            if (foto) {
                await sql`
                    UPDATE instrumentos 
                    SET persona = ${persona}, instrumento = ${instrumento}, nro_parte = ${nro_parte}, nro_serie = ${nro_serie}, foto = ${foto}
                    WHERE id = ${id};
                `;
            } else {
                await sql`
                    UPDATE instrumentos 
                    SET persona = ${persona}, instrumento = ${instrumento}, nro_parte = ${nro_parte}, nro_serie = ${nro_serie}
                    WHERE id = ${id};
                `;
            }
            return res.status(200).json({ mensaje: 'Instrumento actualizado' });
        }

        // DELETE - Eliminar un instrumento
        if (req.method === 'DELETE') {
            const { id } = req.query;
            await sql`DELETE FROM instrumentos WHERE id = ${id};`;
            return res.status(200).json({ mensaje: 'Instrumento eliminado' });
        }

        return res.status(405).json({ error: 'Método no permitido' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
};
