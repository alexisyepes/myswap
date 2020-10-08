const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../models").User;
const Item = require("../models").Item;
const Comment = require("../models").Comment;
const salt = bcrypt.genSaltSync(10);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

// Register
router.post(
  "/signup",
  // passport.authenticate("jwt", {
  //   session: false,
  // }),
  (req, res) => {
    console.log(req.body);

    const {
      firstName,
      lastName,
      username,
      email,
      password,
      userType,
    } = req.body;

    if (password.length < 6) {
      throw "Password debe ser de por lo menos 6 caracteres";
    } else {
      User.findOne({
        where: {
          email,
        },
      }).then((user) => {
        if (user) {
          return res.send({
            status: 400,
            message: "Email ya existe! Inicie sesion, o use un email diferente",
          });
        } else {
          const encryptedPassword = bcrypt.hashSync(password, salt);

          let newUser = {
            firstName,
            lastName,
            username,
            email,
            password: encryptedPassword,
            userType,
          };
          User.create(newUser)
            .then(() => {
              // newUser.isAdmin = true
              delete newUser.password;
              res.send(newUser);
            })
            .catch(function (err) {
              console.log(err);
              res.json(err);
            });
        }
      });
    }
  }
);

// Login Admin
router.post("/login", function (req, res, next) {
  const { email, password } = req.body;
  // generate the authenticate method and pass the req/res
  passport.authenticate("admin-local", function (err, user, info) {
    if (!email || !password) {
      return;
    }
    if (err) {
      return res.status(401).json(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    // req / res held in closure
    req.logIn(user, () => {
      User.findOne({
        where: {
          email: req.body.email,
        },
      })
        .then((user) => {
          const token = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );
          res.status(200).send({
            // auth: true,
            token,
            userType: user.userType,
            username: user.username,
            firstName: user.firstName,
            userId: user.id,
          });
        })
        .catch((err) => console.log(err));
    });
  })(req, res, next);
});

router.get(
  "/admin",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    console.log(req.user);
    return res.json(req.user);
  }
);

router.get(
  "/users_profile",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    return res.json(req.user);
  }
);

router.get(
  "/users",
  passport.authenticate("jwt", {
    session: false,
  }),
  (req, res) => {
    User.findAll({}).then(function (dbUser) {
      res.json(dbUser);
    });
  }
);

//Get all items
router.get("/items", (req, res) => {
  Item.findAll({})
    .then(function (dbUser) {
      res.json(dbUser);
    })
    .catch((err) => console.log(err));
});

//Getting one single User with items and comments
router.get(
  "/user/:id",
  // passport.authenticate(["jwt", "jwtEmployee"], {
  // 	session: false,
  // }),
  (req, res) => {
    // console.log(req.user);
    // console.log(res)
    return User.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: Item,
          include: [{ model: Comment }],
        },
      ],
    })
      .then((dbUser) => {
        let updatedUser = {
          id: dbUser.id,
          firstName: dbUser.firstName,
          lastName: dbUser.lastName,
          username: dbUser.username,
          email: dbUser.email,
          userType: dbUser.userType,

          Items: dbUser.Items.map((item) => {
            return {
              id: item.id,
              itemName: item.itemName,
              description: item.description,
              category: item.category,
              itemPrice: item.itemPrice,
              itemStatus: item.itemStatus,
              itemImg: item.itemImg,
              UserId: item.UserId,
              Comments: item.Comments.map((comment) => {
                return {
                  id: comment.id,
                  date: comment.date,
                  comment: comment.comment,
                  interest: comment.interest,
                  userId: comment.userId,
                };
              }),
            };
          }),
        };

        // console.log(updatedUser);
        res.json(updatedUser);
      })
      .catch((err) => console.log(err));
  }
);

router.get("/item/:id", (req, res) => {
  return Item.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then(function (dbItem) {
      res.json(dbItem);
    })
    .catch((err) => console.log(err));
});

router.put("/item/:id", (req, res) => {
  Item.update(
    {
      ...req.body,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then(function (dbItem) {
      res.json(dbItem);
    })
    .catch((err) => console.log(err));
});

// POST route for saving a new Item to one user
router.post("/user/:UserId", function (req, res) {
  Item.create({
    ...req.body,
    UserId: req.params.UserId,
  })
    .then(function (dbItem) {
      res.json(dbItem);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route for deleting an Item
router.delete("/item/:itemId", function (req, res) {
  Item.destroy({
    where: {
      id: req.params.itemId,
    },
  })
    .then(function (dbItem) {
      res.json(dbItem);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route for saving a new Comment
router.post("/comments/:ItemId", function (req, res) {
  Comment.create({
    ...req.body,
    ItemId: req.params.ItemId,
  })
    .then(function (dbComment) {
      res.json(dbComment);
    })
    .catch(function (err) {
      res.json(err);
    });
});

// POST route for deleting a Comment
router.delete("/comments/:id", function (req, res) {
  Comment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then(function (dbComment) {
      res.json(dbComment);
    })
    .catch(function (err) {
      res.json(err);
    });
});

module.exports = router;
