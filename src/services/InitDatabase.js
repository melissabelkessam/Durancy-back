const db = require('../models'); 

let tablesAlreadySynced = false;

async function createTables() {
  if (tablesAlreadySynced) return;
  try {
    await db.User.sync();
    await db.Partner.sync();
    await db.Kit.sync();
    await db.Order.sync();
    await db.OrderKit.sync();
    await db.Cart.sync();
    await db.Tutorial.sync();
    await db.Review.sync();
    await db.Faq.sync();
    await db.CartKit.sync();

    tablesAlreadySynced = true;
    console.log('✅ Tables synchronisées avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables :', error);
  }
}
module.exports = createTables;
