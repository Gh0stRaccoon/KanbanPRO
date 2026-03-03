require('dotenv/config');
const { pool, verificarConexion } = require('./config/db');

verificarConexion();

// FUNCIÓN DE TRANSFERENCIA CON TRANSACCIÓN

async function realizarTransferencia(cuentaOrigenId, cuentaDestinoId, monto) {
  const client = await pool.connect();

  try {
    console.log('Iniciando transferencia...');

    // 1️⃣ BEGIN
    await client.query('BEGIN');

    // 2️⃣ Restar saldo cuenta origen
    const descontar = `
      UPDATE cuentas
      SET saldo = saldo - $1
      WHERE id = $2
      RETURNING *;
    `;

    const resultadoOrigen = await client.query(descontar, [
      monto,
      cuentaOrigenId,
    ]);

    if (resultadoOrigen.rowCount === 0) {
      throw new Error('Cuenta de origen no existe');
    }

    // 3️⃣ Sumar saldo cuenta destino
    const sumar = `
      UPDATE cuentas
      SET saldo = saldo + $1
      WHERE id = $2
      RETURNING *;
    `;

    const resultadoDestino = await client.query(sumar, [
      monto,
      cuentaDestinoId,
    ]);

    if (resultadoDestino.rowCount === 0) {
      throw new Error('Cuenta de destino no existe');
    }

    // 4️⃣ COMMIT
    await client.query('COMMIT');

    console.log(
      `Transferencia exitosa: $${monto} de cuenta ${cuentaOrigenId} a cuenta ${cuentaDestinoId}`
    );
  } catch (error) {
    // 5️⃣ ROLLBACK
    await client.query('ROLLBACK');
    console.error('Error en la transferencia. Transacción revertida.');
    console.error('Detalle:', error.message);
  } finally {
    // 6️⃣ Liberar cliente
    client.release();
    console.log('Cliente liberado.\n');
  }
}


async function main() {
  try {
    // Transferencia exitosa
    await realizarTransferencia(1, 2, 100.0);

    // Transferencia con saldo insuficiente (activará CHECK saldo >= 0)
    await realizarTransferencia(2, 1, 600.0);
  } catch (error) {
    console.error('Error general:', error.message);
  } finally {
    await pool.end();
  }
}

main(); 