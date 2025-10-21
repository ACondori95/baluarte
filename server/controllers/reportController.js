// controllers/reportController.js

const Transaction = require("../models/Transaction");
const Category = require("../models/Category");

/**
 * @desc    Obtener un resumen del flujo de caja (Ingresos vs. Egresos) agrupado por mes
 * @route   GET /api/reports/cashflow
 * @access  Privado
 */
const getMonthlyCashFlow = async (req, res) => {
  const user = req.user._id;

  try {
    // Pipeline de Agregación de MongoDB
    const results = await Transaction.aggregate([
      // 1. Filtrar por el usuario actual
      {$match: {user: user}},

      // 2. Agrupar por Mes y Año, y calcular los totales
      {
        $group: {
          _id: {
            year: {$year: "$date"},
            month: {$month: "$date"},
            type: "$type", // Agrupamos por tipo (Ingreso/Egreso)
          },
          totalAmount: {$sum: "$amount"},
        },
      },

      // 3. Reestructurar el resultado para que sea más fácil de consumir
      // Agrupamos de nuevo por Mes y Año para tener Ingreso y Egreso en el mismo objeto
      {
        $group: {
          _id: {
            year: "$_id.year",
            month: "$_id.month",
          },
          // Condicionalmente, creamos los campos 'ingreso' o 'egreso'
          ingresos: {
            $sum: {
              $cond: [{$eq: ["$_id.type", "Ingreso"]}, "$totalAmount", 0],
            },
          },
          egresos: {
            $sum: {
              $cond: [{$eq: ["$_id.type", "Egreso"]}, "$totalAmount", 0],
            },
          },
        },
      },

      // 4. Ordenar cronológicamente (opcional, pero ayuda al dashboard)
      {$sort: {"_id.year": 1, "_id.month": 1}},
    ]);

    // Formatear la salida para que sea más limpia para el frontend
    const formattedResults = results.map((item) => ({
      month: item._id.month,
      year: item._id.year,
      ingresos: item.ingresos,
      egresos: item.egresos,
      neto: item.ingresos - item.egresos,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al calcular el flujo de caja.",
      error: error.message,
    });
  }
};

/**
 * @desc    Obtener la distribución de gastos por categoría (Top Egresos)
 * @route   GET /api/reports/expenses-by-category
 * @access  Privado
 */
const getExpensesByCategory = async (req, res) => {
  const user = req.user._id;

  try {
    const results = await Transaction.aggregate([
      // 1. Filtrar por usuario y solo Transacciones de Egreso
      {$match: {user: user, type: "Egreso"}},

      // 2. Agrupar por Categoría y sumar el monto
      {
        $group: {
          _id: "$category", // Agrupar por ID de Categoría
          totalSpent: {$sum: "$amount"},
        },
      },

      // 3. Buscar (lookup) el nombre de la categoría usando el ID
      {
        $lookup: {
          from: "categories", // Nombre de la colección en MongoDB (Mongoose pluraliza por defecto)
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      // 4. Desanidar la información de la categoría
      {$unwind: "$categoryDetails"},

      // 5. Proyectar el resultado para darle un formato limpio
      {
        $project: {
          _id: 0,
          categoryName: "$categoryDetails.name",
          totalSpent: 1,
        },
      },

      // 6. Ordenar por el total gastado (descendente)
      {$sort: {totalSpent: -1}},
    ]);

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al calcular gastos por categoría.",
      error: error.message,
    });
  }
};

module.exports = {
  getMonthlyCashFlow,
  getExpensesByCategory,
};
