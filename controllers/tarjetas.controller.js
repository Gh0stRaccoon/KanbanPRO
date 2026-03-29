const { Tarjeta, Lista, Tablero } = require("../models");

/* CREAR tarjeta */
exports.createTarjeta = async (req, res) => {
  const { titulo, descripcion } = req.body;
  const { listaId } = req.params;

  try {
    // Validar propiedad del usuario
    const lista = await Lista.findByPk(listaId, {
      include: {
        model: Tablero,
        as: "tablero"
      }
    });

    
  console.log("TOKEN USER:", req.usuario.id);
console.log("TABLERO USER:", lista.tablero.userId);
console.log("LISTA ID:", listaId);

    if (!lista) {
  return res.status(404).json({ error: "Lista no encontrada" });
}

if (lista.tablero.userId !== req.usuario.id) {
  return res.status(403).json({ error: "No autorizado" });
}

    const nuevaTarjeta = await Tarjeta.create({
      titulo,
      descripcion,
      listaId
    });

    res.status(201).json(nuevaTarjeta);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando tarjeta" });
  }
};

/* EDITAR tarjeta */
exports.updateTarjeta = async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion } = req.body;

  try {
    const tarjeta = await Tarjeta.findByPk(id, {
      include: {
        model: Lista,
        as: "lista",
        include: {
          model: Tablero,
          as: "tablero"
        }
      }
    });

    if (!tarjeta || tarjeta.lista.tablero.userId !== req.usuario.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    tarjeta.titulo = titulo ?? tarjeta.titulo;
    tarjeta.descripcion = descripcion ?? tarjeta.descripcion;

    await tarjeta.save();

    res.json(tarjeta);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando tarjeta" });
  }
};

/* ELIMINAR tarjeta */
exports.deleteTarjeta = async (req, res) => {
  const { id } = req.params;

  try {
    const tarjeta = await Tarjeta.findByPk(id, {
      include: {
        model: Lista,
        as: "lista",
        include: {
          model: Tablero,
          as: "tablero"
        }
      }
    });

    if (!tarjeta || tarjeta.lista.tablero.userId !== req.usuario.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await tarjeta.destroy();

    res.json({ message: "Tarjeta eliminada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando tarjeta" });
  }
};