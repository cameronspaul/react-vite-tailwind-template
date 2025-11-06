import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(githubProfile) {
        return {
          id: githubProfile.id.toString(),
          name: githubProfile.name || githubProfile.login,
          email: githubProfile.email,
          image: githubProfile.avatar_url,
          provider: "github",
          providerId: githubProfile.id.toString(),
          creationDate: Date.now(),
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      profile(googleProfile) {
        return {
          id: googleProfile.sub,
          name: googleProfile.name,
          email: googleProfile.email,
          image: googleProfile.picture,
          provider: "google",
          providerId: googleProfile.sub,
          creationDate: Date.now(),
        };
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId }) {
      // Set the creation date when a new user is created
      const user = await ctx.db.get(userId);
      if (user && !user.creationDate) {
        await ctx.db.patch(userId, {
          creationDate: Date.now(),
        });
      }
    },
  },
});
