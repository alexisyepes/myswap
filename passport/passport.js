const LocalStrategy = require("passport-local").Strategy;
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const bcrypt = require("bcryptjs");
const User = require("../models").User;
const Comment = require("../models").Comment;
const Item = require("../models").Item;
require("dotenv").config();

module.exports = function (passport) {
  passport.use(
    "admin-local",
    new LocalStrategy(
      // Our user will sign in using an email, rather than a "username"
      {
        usernameField: "email",
      },
      function (email, password, done) {
        // When a user tries to sign in this code runs
        User.findOne({
          where: {
            email,
          },
        }).then((user) => {
          if (!user || !user.password) {
            return done(null, false, {
              message: "No hay ningun usuario con esas credenciales!",
            });
          }
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, {
                message: "Email o Password no son validos...Intente de nuevo",
              });
            }
          });
        });
      }
    )
  );

  const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme("JWT"),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    "jwt",
    new JWTstrategy(opts, (jwt_payload, done) => {
      try {
        User.findOne({
          where: {
            email: jwt_payload.email,
          },
          include: [
            {
              model: Item,
              include: [{ model: Comment }],
            },
          ],
        }).then((user) => {
          if (user) {
            let updatedUser = {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              email: user.email,
              userType: user.userType,

              Items: user.Items.map((item) => {
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

            done(null, updatedUser);
          } else {
            console.log("user not found in db");
            done(null, false);
          }
        });
      } catch (err) {
        done(err);
      }
    })
  );
};
