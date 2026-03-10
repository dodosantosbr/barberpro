const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const prisma = require("./prisma");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const name = profile.displayName;
        const providerId = profile.id;

        if (!email) {
          return done(new Error("Google não retornou email"), null);
        }

        // ✅ NÃO ALTERA A URL
        const photo = profile.photos?.[0]?.value || null;

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // 🔎 Verifica se já existe barbershop com esse email
          let barbershop = await prisma.barbershop.findUnique({
            where: { email },
          });

          // 🆕 Se não existir, cria
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
        } else if (!user.image && photo) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { image: photo },
          });
        }

        return done(null, user);
      } catch (error) {
        console.error("ERRO GOOGLE DETALHADO:");
        console.error(error);
        console.error(error.message);
        console.error(error.stack);
        return done(error, null);
      }
    }
  )
);
