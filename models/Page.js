module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    person: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: false,
    underscored: true,
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
  });

  Page.associate = (db) => {
    db.Page.belongsTo(db.User, { foreignKey: 'person', targetKey: 'id' });
  };

  return Page;
};
