module.exports = (sequelize, DataTypes) => {
  const Report = sequelize.define('report', {
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    reason: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  }, {
    timestamps: false,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  Report.associate = function(db) {
    db.Report.belongsTo(db.User, { foreignKey: 'reporter', targetKey: 'id' });
  };

  return Report;
};
