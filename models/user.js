const User = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    key: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    idx: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      autoIncrement: true,
    },
  });
};

module.exports = User;
