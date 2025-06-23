import utils from "@strapi/utils";
const { sanitize } = utils;

export const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::users-permissions.user");
  const { auth } = ctx.state;
  return sanitize.contentAPI.output(user, schema, { auth });
};

export const getService = (name) => {
  return strapi.plugin("users-permissions").service(name);
};

/**
 * @description Generate referralCode for users
 * @param {Number} length
 * @returns referralCode
 */

export const generateReferralCode = (length) => {
  let referralCode = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    referralCode += characters.charAt(
      Math.floor(Math.random() * charactersLength),
    );
  }
  return referralCode;
};

/**
 * @description Normalize Gmail addresses by removing dots from local part
 * Gmail ignores dots in the local part of the email address
 * @param {string} email - The email address to normalize
 * @returns {string} - Normalized email address
 */
export const normalizeGmailAddress = (email) => {
  if (!email || typeof email !== 'string') {
    return email;
  }
  
  const [localPart, domain] = email.toLowerCase().split('@');
  
  // Check if it's a Gmail domain (gmail.com, googlemail.com)
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Remove all dots from the local part
    const normalizedLocalPart = localPart.replace(/\./g, '');
    return `${normalizedLocalPart}@${domain}`;
  }
  
  return email.toLowerCase();
};

/**
 * @description Generate all possible Gmail variants for a given email
 * This is used to check for existing accounts with different dot patterns
 * @param {string} email - The email address
 * @returns {string[]} - Array of possible email variants
 */
export const generateGmailVariants = (email) => {
  if (!email || typeof email !== 'string') {
    return [];
  }
  
  const [localPart, domain] = email.toLowerCase().split('@');
  
  // Only generate variants for Gmail domains
  if (domain !== 'gmail.com' && domain !== 'googlemail.com') {
    return [email.toLowerCase()];
  }
  
  // Remove all dots first to get the base local part
  const baseLocalPart = localPart.replace(/\./g, '');
  
  // Generate variants by adding dots in different positions
  const variants = [baseLocalPart]; // No dots
  
  // Add dots in different positions (up to 3 dots to avoid too many combinations)
  for (let i = 1; i <= Math.min(3, baseLocalPart.length - 1); i++) {
    const positions = [];
    for (let j = 0; j < baseLocalPart.length - 1; j++) {
      positions.push(j);
    }
    
    // Generate combinations of i positions
    const combinations = getCombinations(positions, i);
    
    for (const combination of combinations) {
      let variant = '';
      for (let k = 0; k < baseLocalPart.length; k++) {
        variant += baseLocalPart[k];
        if (combination.includes(k)) {
          variant += '.';
        }
      }
      variants.push(variant);
    }
  }
  
  return variants.map(variant => `${variant}@${domain}`);
};

/**
 * @description Generate combinations of array elements
 * @param {any[]} arr - Array to generate combinations from
 * @param {number} size - Size of each combination
 * @returns {any[][]} - Array of combinations
 */
const getCombinations = (arr, size) => {
  if (size === 0) return [[]];
  if (arr.length === 0) return [];
  
  const [first, ...rest] = arr;
  const withoutFirst = getCombinations(rest, size);
  const withFirst = getCombinations(rest, size - 1).map(combo => [first, ...combo]);
  
  return [...withoutFirst, ...withFirst];
};
