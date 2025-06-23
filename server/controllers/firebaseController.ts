// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const strapi: any;
import { normalizeGmailAddress } from "../utils";

const firebaseController = {
  index(ctx) {
    ctx.body = strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .getWelcomeMessage();
  },

  async validateToken(ctx) {
    ctx.body = await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .validateFirebaseToken(ctx);
  },

  async createAlias(ctx) {
    ctx.body = await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .createAlias(ctx);
  },

  async deleteByEmail(email) {
    // Normalize Gmail address before searching
    const normalizedEmail = normalizeGmailAddress(email);
    const user = await strapi.firebase.auth().getUserByEmail(normalizedEmail);
    await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .delete(user.toJSON().uid);
    return user.toJSON();
  },

  async overrideAccess(ctx) {
    ctx.body = await strapi
      .plugin("firebase-auth")
      .service("firebaseService")
      .overrideFirebaseAccess(ctx);
  },
};

export default firebaseController;
