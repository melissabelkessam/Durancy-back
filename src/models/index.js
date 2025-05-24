const User = require('./User');
const Partner = require('./Partner');
const Kit = require('./Kit');
const Order = require('./Order');
const OrderKit = require('./OrderKit');
const Cart = require('./Cart');
const Tutorial = require('./Tutorial');
const Review = require('./Review');
const Faq = require('./Faq');
const CartKit = require('./CartKit');

const db = {
  User,
  Partner,
  Kit,
  Order,
  OrderKit,
  Cart,
  Tutorial,
  Review,
  Faq,
  CartKit
};

// Appliquer les associations
Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
