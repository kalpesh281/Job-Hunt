const express = require("express");
const jwt = require("jsonwebtoken");
const authKeys = require("../lib/authKeys");
const bcrypt = require("bcrypt");
const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const AdminInfo = require("../db/Admin");
const Admin = require("../db/Admin");
const router = express.Router();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv").config()

router.post("/signup", (req, res) => {
  const data = req.body;
  if (data.password.length < 8) {
    res.status(400).json({
      message: "Password must be more than 8 characters.",
    })
    return;
  }
  User.findOne({ email: data.email })
    .then((user) => {
      if (user != null) {
        res.status(400).json({
          message: "The email address you have entered is already associated with another account.",
        });
        return;
      } else {
        let user = new User({
          email: data.email,
          password: data.password,
          type: data.type,
        });

        user
          .save()
          .then(() => {
            const userDetails =
              user.type == "recruiter"
                ? new Recruiter({
                  userId: user._id,
                  name: data.name,
                  contactNumber: data.contactNumber,
                  bio: data.bio,
                }): user.type=="admin"? new Admin(
                  {
                    userId: user._id,
                    name: data.name,
                  }
                )
                : new JobApplicant({
                  userId: user._id,
                  name: data.name,
                  education: data.education,
                  skills: data.skills,
                  rating: data.rating,
                  resume: data.resume,
                  profile: data.profile,
                });

            userDetails
              .save()
              .then(() => {
                // Token
                const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
                res.json({
                  token: token,
                  type: user.type,
                });
              })
              .catch((err) => {
                user
                  .delete()
                  .then(() => {
                    res.status(400).json(err);
                  })
                  .catch((err) => {
                    res.json({ error: err });
                  });
                err;
              });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
});

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: "http://localhost:8080/auth/signup/google" // Update the callback URL
// }, function (accessToken, refreshToken, profile, done) {
//   const email = profile.emails[0].value;
//   User.findOne({ email: email })
//     .then((user) => {
//       if (user) {
//         // Update access token and refresh token for existing user
//         user.accessToken = accessToken;
//         user.refreshToken = refreshToken;
//         user.save()
//           .then(updatedUser => {
//             done(null, updatedUser);
//           })
//           .catch(err => {
//             done(err, null);
//           });
//       } else {
//         // Create new user with access token and refresh token
//         let newUser = new User({
//           email: email,
//           username: profile.displayName,
//           googleId: profile.id,
//           accessToken: accessToken,
//           refreshToken: refreshToken,
//           type: "applicant" // Set default type to applicant
//         });
//         newUser.save()
//           .then((newUser) => {
//             done(null, newUser);
//           })
//           .catch(err => {
//             done(err, null);
//           });
//       }
//     })
//     .catch(err => {
//       done(err, null);
//     });
// }));

// Route to handle Google signup
router.get("/signup/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback route after Google authentication
// router.get("/signup/google/callback", passport.authenticate("google", {
//   failureRedirect: "/login" // Redirect to login page on failure
// }), (req, res) => {
//   // Redirect to a success page or send response as needed
//   res.redirect("/success");
// });













// router.post("/signup/google", (req, res) => {
//   const googleData = req.body;
//   const email = googleData.email;

//   User.findOne({ email: email })
//     .then((user) => {
//       if (user != null) {
//         res.status(400).json({
//           message: "The email address you have entered is already associated with another account.",
//         });
//       } else {
//         let newUser = new User({
//           email: email,
        
//           type: "applicant", 
//         });

//         newUser
//           .save()
//           .then(() => {
//             let userDetails;
//             switch (newUser.type) {
//               case "recruiter":
//                 userDetails = new Recruiter({
//                   userId: newUser._id,
//                   // Add recruiter details
//                 });
//                 break;
//               case "admin":
//                 userDetails = new Admin({
//                   userId: newUser._id,
//                   // Add admin details
//                 });
//                 break;
//               default:
//                 userDetails = new JobApplicant({
//                   userId: newUser._id,
//                   // Add job applicant details
//                 });
//             }

//             userDetails
//               .save()
//               .then(() => {
//                 const token = jwt.sign({ _id: newUser._id }, authKeys.jwtSecretKey);
//                 res.json({
//                   token: token,
//                   type: newUser.type,
//                 });
//               })
//               .catch((err) => {
//                 res.status(400).json(err);
//               });
//           })
//           .catch((err) => {
//             res.status(400).json(err);
//           });
//       }
//     })
//     .catch((err) => {
//       res.status(400).json(err);
//     });
// });

router.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.status(401).json(info);
        return;
      }
      // Token
      const token = jwt.sign({ _id: user._id }, authKeys.jwtSecretKey);
      res.json({
        token: token,
        type: user.type,
      });
    }
  )(req, res, next);
});


router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Check if the email exists in the database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's password
    user.password = newPassword; // Assuming newPassword is already hashed if necessary
    await user.save();

    // Send a success response
    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    // Handle errors
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});



module.exports = router;
