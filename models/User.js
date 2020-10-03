module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    key: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    rank: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'bronze',
    },
    eval_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    timestamps: false,
    underscored: true,
  });

  User.associate = function(db) {
    db.User.hasMany(db.Page, { foreignKey: 'person', sourceKey: 'id' });
  };

  return User;
};
