module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    key: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    sign: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(400),
      allowNull: false,
    },
    rank: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'bronze',
    },
    count: {
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
    db.User.hasMany(db.Dict, { foreignKey: 'person', sourceKey: 'id' });
  };

  return User;
};
