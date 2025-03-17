import mongoose from "monsoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Passwords should behashed in a real app.
});
export default mongoose.model("User", userSchema);
