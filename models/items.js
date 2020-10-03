module.exports = function (sequelize, DataTypes) {
  var Item = sequelize.define(
    "Item",
    {
      itemName: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1],
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        len: [1],
      },
      category: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      itemPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      itemStatus: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      itemImg: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  Item.associate = function (models) {
    Item.belongsTo(models.User);
    Item.hasMany(models.Comment, {
      onDelete: "cascade",
    });
  };

  return Item;
};
