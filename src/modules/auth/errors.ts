type FieldError = {
  code: string;
  message: string;
  longMessage?: string;
};

type ClerkErrorFields = {
  identifier?: FieldError | null;
  password?: FieldError | null;
  code?: FieldError | null;
  emailAddress?: FieldError | null;
};

type ClerkErrors = {
  fields?: ClerkErrorFields | null;
  global?: { code: string; message: string }[] | null;
  raw?: unknown[] | null;
};

type ClerkLikeError = { code?: string; message?: string; longMessage?: string };

const messages: Record<string, string> = {
  form_identifier_not_found:
    "No account found with that email address. Check it or create an account.",
  form_password_incorrect: "Incorrect email or password.",
  form_identifier_exists: "An account with this email already exists. Try signing in instead.",
  form_email_address_exists: "An account with this email already exists. Try signing in instead.",
  form_username_exists: "An account with this username already exists. Try signing in instead.",
  form_password_pwned:
    "That password has appeared in a known data breach. Choose a different one.",
  form_password_too_short: "Your password does not meet the requirements.",
  form_password_too_long: "Your password does not meet the requirements.",
  form_password_missing_uppercase: "Your password does not meet the requirements.",
  form_password_missing_lowercase: "Your password does not meet the requirements.",
  form_password_missing_number: "Your password does not meet the requirements.",
  form_password_missing_special_character: "Your password does not meet the requirements.",
  form_password_validation_failed: "Your password does not meet the requirements.",
  form_code_incorrect: "That code isn't right — check it and try again.",
  form_code_expired: "That code has expired. Request a new one.",
  verification_expired: "That code has expired. Request a new one.",
  verification_failed: "That code isn't right — check it and try again.",
  too_many_requests: "Too many attempts. Wait a moment and try again.",
  form_param_nil: "Something's missing — check the form and try again.",
  captcha_invalid: "We couldn't verify you're human. Please try again.",
  captcha_required: "We couldn't verify you're human. Please try again.",
  form_email_address_not_allowed: "This email address isn't allowed to create an account.",
  form_identifier_not_allowed: "This email address isn't allowed to create an account.",
  oauth_access_denied: "You didn't grant access to your Google account.",
  oauth_callback_failed: "Google sign-in didn't complete. Please try again.",
  oauth_failed: "Google sign-in didn't complete. Please try again.",
  session_expired: "Your session expired. Please sign in again.",
  not_allowed_access: "You don't have access to this.",
};

const generic = "Something went wrong. Please try again.";

export function clerkCodeToMessage(code: string): string | undefined {
  return messages[code];
}

export function clerkErrorToMessage(error: ClerkLikeError | null | undefined): string | undefined {
  if (!error) return undefined;
  if (error.code && messages[error.code]) return messages[error.code];
  if (error.longMessage) return error.longMessage;
  if (error.message) return error.message;
  return generic;
}

export function clerkFieldMessage(
  errors: ClerkErrors | null | undefined,
  field: keyof ClerkErrorFields
): string | undefined {
  const fieldError = errors?.fields?.[field];
  if (!fieldError) return undefined;
  return clerkErrorToMessage(fieldError);
}

export function clerkGlobalMessage(errors: ClerkErrors | null | undefined): string | undefined {
  const global = errors?.global;
  if (!global || global.length === 0) return undefined;
  return clerkErrorToMessage(global[0]);
}

export function clerkErrorsMessage(
  errors: ClerkErrors | null | undefined,
  fields: (keyof ClerkErrorFields)[]
): string | undefined {
  if (!errors) return undefined;
  for (const field of fields) {
    const message = clerkFieldMessage(errors, field);
    if (message) return message;
  }
  return clerkGlobalMessage(errors);
}
