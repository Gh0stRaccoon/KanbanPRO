const { Tablero, Lista } = require("../models");

/* GET tableros del usuario */
exports.getTableros = async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
      where: { userId: req.usuario.id }
    });

    res.json(tableros);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo tableros" });
  }
};

/* CREAR tablero */
exports.createTablero = async (req, res) => {
  const { titulo } = req.body;

  try {
    const userId = req.usuario.id;

    // Crear tablero
    const tablero = await Tablero.create({
      titulo,
      userId
    });

    // Listas base
    const listasBase = [
      { titulo: "Pendiente", tipo: "todo" },
      { titulo: "En progreso", tipo: "doing" },
      { titulo: "Hecho", tipo: "done" }
    ];

    const listas = await Lista.bulkCreate(
      listasBase.map(lista => ({
        titulo: lista.titulo,
        tipo: lista.tipo,
        tableroId: tablero.id
      }))
    );

    res.status(201).json({
      tablero,
      listas
    });

  } catch (error) {
    console.error("ERROR CREANDO TABLERO:", error);
    res.status(500).json({ error: "Error creando tablero" });
  }
};