const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../services/ConnexionDB');

class Kit extends Model {}

Kit.init({
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.BIGINT, allowNull: false, defaultValue: 0 },
  category: { type: DataTypes.STRING, allowNull: true },
  image: { type: DataTypes.STRING, allowNull: true } // 🖼️ Champ image
}, {
  sequelize,
  modelName: 'Kit',
  tableName: 'kits',
  timestamps: true,
  underscored: true
});

Kit.associate = (models) => {
  Kit.hasMany(models.Tutorial, {
    foreignKey: 'kit_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};


module.exports = Kit;
