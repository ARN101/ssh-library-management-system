/** KUET email domains used for registration / login validation. */
export const KUET_EMAIL_REGEX =
  /^[a-zA-Z0-9._%+-]+@(stud\.)?kuet\.ac\.bd$/i;

export const isKuetEmail = (email) => KUET_EMAIL_REGEX.test(String(email || ""));

export const kuetEmailRules = [
  { required: true, message: "Please enter your KUET email" },
  {
    validator: (_, value) => {
      if (!value || isKuetEmail(value)) {
        return Promise.resolve();
      }
      return Promise.reject(
        new Error("Use a valid KUET email (@stud.kuet.ac.bd or @kuet.ac.bd)")
      );
    },
  },
];

/** Role implied by email domain (must match backend deriveRole). */
export const deriveRoleFromEmail = (email) => {
  const lower = String(email || "").toLowerCase();
  if (lower.endsWith("@stud.kuet.ac.bd")) return "student";
  if (lower.endsWith("@kuet.ac.bd")) return "librarian";
  return "student";
};
