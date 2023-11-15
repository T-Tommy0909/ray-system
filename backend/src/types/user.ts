import { Static, Type } from "@sinclair/typebox";

export const UserBaseSchema = Type.Object({
  id: Type.Number(),
  email: Type.String({ format: "email" }),
});
export type UserBasePayload = Static<typeof UserBaseSchema>;
