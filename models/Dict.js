module.exports = (sequelize, DataTypes) => {
  const Dict = sequelize.define('dict', {
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING(1500),
      allowNull: false,
    },
    allow: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    allowedAt: {
      type: DataTypes.STRING(35),
      allowNull: false,
      defaultValue: 'not',
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

  Dict.associate = (db) => {
    db.Dict.belongsTo(db.User, { foreignKey: 'person', targetKey: 'id' });
  };

  return Dict;
};
