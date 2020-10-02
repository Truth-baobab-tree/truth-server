module.exports = (sequelize, DataTypes) => {
  const Page = sequelize.define('page', {
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
  }, {
    timestamps: false,
    underscored: true,
  });

  Page.associate = (db) => {
    
  };

  return Page;
};
