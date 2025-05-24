const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../services/ConnexionDB');

class Tutorial extends Model {}

Tutorial.init({
  title: { type: DataTypes.STRING, allowNull: false },
  video_url: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  kit_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  sequelize,
  modelName: 'Tutorial',
  tableName: 'tutorials',
  timestamps: true,
  underscored: true
});

Tutorial.associate = (models) => {
  Tutorial.belongsTo(models.Kit, {
    foreignKey: 'kit_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  });
};

module.exports = Tutorial;
