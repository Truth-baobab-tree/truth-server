const Page = (sequelize, DataTypes) => {
  return sequelize.define('page', {
    url: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
      primaryKey: true,
    },
    like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bad: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    person: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
  });
};

module.exports = { Page };
