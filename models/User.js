module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    key: {
      type: DataTypes.STRING(600),
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
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 5,
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

  User.associate = (db) => {
    db.User.hasMany(db.Page, { foreignKey: 'person', sourceKey: 'id' });
  };

  return User;
};
