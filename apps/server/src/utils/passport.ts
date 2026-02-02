import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import type { VerifyCallback } from "passport-google-oauth2";
import passport from "passport";
import { db, users } from "@repo/db";
import { eq } from "drizzle-orm";
import config from "../config/index.js";

// Configure Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.redirectUri,
      passReqToCallback: true,
    },
    async (
      request: any,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ) => {
      try {
        // Check if user exists with this Google ID
        const existingUser = await db.query.users.findFirst({
          where: eq(users.googleId, profile.id),
        });

        if (existingUser) {
          // User exists, return it
          return done(null, existingUser);
        }

        // Check if user exists with this email
        const userByEmail = await db.query.users.findFirst({
          where: eq(users.email, profile.email!),
        });

        if (userByEmail) {
          // Link Google account to existing user
          const [updatedUser] = await db
            .update(users)
            .set({ googleId: profile.id })
            .where(eq(users.id, userByEmail.id))
            .returning();

          return done(null, updatedUser);
        }

        // Create new user
        const [newUser] = await db
          .insert(users)
          .values({
            name: profile.displayName,
            email: profile.email!,
            googleId: profile.id,
            passwordHash: null, // Google OAuth users don't have passwords
          })
          .returning();

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    },
  ),
);

// Serialize user for session (if using sessions)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session (if using sessions)
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
