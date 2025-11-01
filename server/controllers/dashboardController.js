const asyncHandler = require("express-async-handler");
const Transaction = require("../models/TransactionModel");
const Category = require("../models/CategoryModel");
const User = require("../models/UserModel");

/**
 * @desc   Obtener todos los datos del dashboard para el mes actual
 * @route  GET /api/dashboard
 * @access Private
 */
const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fechas del mes actual
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date();

  // 1. Balance y Resumen (Flujo de Caja)
  const balanceSummary = await Transaction.aggregate([
    {$match: {user: userId, date: {$gte: startOfMonth, $lte: endOfMonth}}},
    {
      $group: {
        _id: "$type", // Agrupar por INGRESO o EGRESO
        total: {$sum: "$amount"},
      },
    },
  ]);

  let totalIngresos = 0;
  let totalEgresos = 0;

  balanceSummary.forEach((item) => {
    if (item._id === "INGRESO") {
      totalIngresos = item.total;
    } else if (item._id === "EGRESO") {
      totalEgresos = item.total;
    }
  });

  const currentBalance = totalIngresos - totalEgresos;

  // 2. Transacciones Recientes (para la tabla)
  const recentTransactions = await Transaction.find({user: userId})
    .populate("category", "name type")
    .sort({date: -1})
    .limit(5); // Mostrar solo las últimas 5 en el dashboard

  // 3. Comparativa Presupuesto vs. Gasto (por Categoría)
  // Obtener las categorías de egreso activas con presupuesto
  const expenseCategories = await Category.find({
    user: userId,
    type: "EGRESO",
    isActive: true,
  }).select("_id name monthlyBudget");

  const categoryIds = expenseCategories.map((cat) => cat.id);

  // Sumar el gasto real en estas categorías para el mes actual
  const expensesByCategory = await Transaction.aggregate([
    {
      $match: {
        user: userId,
        type: "EGRESO",
        category: {$in: categoryIds},
        date: {$gte: startOfMonth, $lte: endOfMonth},
      },
    },
    {$group: {_id: "$category", spent: {$sum: "$amount"}}},
  ]);

  // Unir los datos de presupuesto y gasto
  const budgetVsExpense = expenseCategories
    .map((cat) => {
      const expenseData = expensesByCategory.find((exp) =>
        exp._id.equals(cat._id)
      );
      return {
        categoryName: cat.name,
        monthlyBudget: cat.monthlyBudget,
        spent: expenseData ? expenseData.spent : 0,
        remaining: cat.monthlyBudget - (expenseData ? expenseData.spent : 0),
      };
    })
    .filter((item) => item.monthlyBudget > 0); // Solo mostrar las que tienen presupuesto

  // 4. Conteo de Transacciones (Para el indicado del Plan Base)
  const user = await User.findById(userId);
  const isBasePlan = user.role === "base";
  let transactionCount = 0;

  if (isBasePlan) {
    transactionCount = await Transaction.countDocuments({
      user: userId,
      date: {$gte: startOfMonth, $lte: endOfMonth},
    });
  }

  // Respuesta final del Dashboard
  res.json({
    balance: {currentBalance, totalIngresos, totalEgresos},
    recentTransactions,
    budgetVsExpense,
    planInfo: {
      isBasePlan,
      currentCount: isBasePlan ? transactionCount : -1, // -1 o null si es PRO
      limit: 50, // Se mantiene la referencia al límite
    },
  });
});

module.exports = {getDashboardData};
