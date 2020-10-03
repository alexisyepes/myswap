module.exports = function (sequelize, DataTypes) {
  var Comment = sequelize.define(
    "Comment",
    {
      date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      interest: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      userId: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    }
  );

  Comment.associate = function (models) {
    Comment.belongsTo(models.Item);
    onDelete = "CASCADE";
  };

  return Comment;
};
