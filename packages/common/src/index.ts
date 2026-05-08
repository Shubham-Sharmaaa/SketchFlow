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
const CreateRoom = z.object({
  slug: z.string().max(20),
});
export { Signup, Signin, CreateRoom };
