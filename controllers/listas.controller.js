const { Lista, Tablero } = require("../models");

/* =========================
   CREAR lista
========================= */
exports.createLista = async (req, res) => {
  const { titulo } = req.body;
  const { tableroId } = req.params;

  try {
    // Validar que el tablero pertenece al usuario
    const tablero = await Tablero.findOne({
      where: {
        id: tableroId,
        userId: req.usuario.id
      }
    });

    if (!tablero) {
      return res.status(404).json({ error: "Tablero no encontrado" });
    }

    const nuevaLista = await Lista.create({
      titulo,
      tableroId
    });

    res.status(201).json(nuevaLista);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando lista" });
  }
};

/* =========================
   EDITAR lista
========================= */
exports.updateLista = async (req, res) => {
  const { id } = req.params;
  const { titulo } = req.body;

  try {
    const lista = await Lista.findByPk(id, {
      include: {
        model: Tablero,
        as: "tablero"
      }
    });

    if (!lista || lista.tablero.userId !== req.usuario.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    lista.titulo = titulo;
    await lista.save();

    res.json(lista);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error actualizando lista" });
  }
};

/* =========================
   ELIMINAR lista
========================= */
exports.deleteLista = async (req, res) => {
  const { id } = req.params;

  try {
    const lista = await Lista.findByPk(id, {
      include: {
        model: Tablero,
        as: "tablero"
      }
    });

    if (!lista || lista.tablero.userId !== req.usuario.id) {
      return res.status(403).json({ error: "No autorizado" });
    }

    await lista.destroy();

    res.json({ message: "Lista eliminada" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error eliminando lista" });
  }
};