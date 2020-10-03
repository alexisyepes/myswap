const { v4: uuidv4 } = require("uuid");

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [1],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING,
      default: true,
      allowNull: false,
    },
  });

  User.beforeCreate((user, _) => {
    return (user.id = uuidv4());
  });

  User.associate = function (models) {
    // When a User is deleted, also delete any associated Pets
    User.hasMany(models.Item, {
      onDelete: "cascade",
    });
  };

  return User;
};
