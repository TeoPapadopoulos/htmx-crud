import { t, type UnwrapSchema } from "elysia";

export const AuthModel = {
  emailForm: t.Object({
    email: t.String({ minLength: 1, format: "email" }),
    password: t.String({ minLength: 8, maxLength: 128 }),
  }),
  signUpForm: t.Object({
    name: t.String({ minLength: 1, maxLength: 80 }),
    email: t.String({ minLength: 1, format: "email" }),
    password: t.String({ minLength: 8, maxLength: 128 }),
  }),
} as const;

export type AuthModel = {
  [K in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[K]>;
};
