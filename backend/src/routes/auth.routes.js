const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

// iniciar login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// callback google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          id: user.id,
          barbershopId: user.barbershopId,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const frontendUrl = process.env.FRONTEND_URL;

      return res.redirect(`${frontendUrl}/auth/success?token=${token}`);
    } catch (error) {
      console.error(error);
      return res.redirect(`${process.env.FRONTEND_URL}/login`);
    }
  }
);

module.exports = router;
