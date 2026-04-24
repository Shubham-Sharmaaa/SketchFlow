import { z, email, maxLength, string } from "zod";

const Signup = z.object({
  email: email(),
  username: z.string(),
  password: z.string(),
});
const Signin = z.object({
  email: email(),
  password: z.string(),
});

export { Signup, Signin };
