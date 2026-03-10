const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("../config/prisma");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // usa variável de ambiente
      callbackURL: `${process.env.API_URL}/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const name = profile.displayName;
        const providerId = profile.id;
        const photo = profile.photos?.[0]?.value || null;

        if (!email) {
          return done(new Error("Google não retornou email"), null);
        }

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          let barbershop = await prisma.barbershop.findUnique({
            where: { email },
          });

          if (!barbershop) {
            barbershop = await prisma.barbershop.create({
              data: {
                name: `${name} Barbearia`,
                email,
              },
            });
          }

          user = await prisma.user.create({
            data: {
              name,
              email,
              image: photo,
              provider: "google",
              providerId,
              barbershopId: barbershop.id,
            },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("🔥 ERRO GOOGLE:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
