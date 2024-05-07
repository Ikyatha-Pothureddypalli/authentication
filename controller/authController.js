import { createJWT } from "../utils/tokenUtils.js";
import { UserData } from "../models/schema.js";
import { hashPassword, comparedPassword } from "../utils/passwordUtils.js";


/*     SIGNUP    */
export const Registration = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    //Check if user already exists in the database
    const user = await UserData.findOne({ email });
    if (user) {
      return res.status(400).send({ message: "Email is already exists" });
    }
    //hashing the password
    const hashedPassword = await hashPassword(password);
    const newUser = await UserData.create({
      username,
      email,
      password: hashedPassword,
      role,
    });
    //saving the new user to database
    const token = createJWT({
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
    });
    // console.log(token);
    res.status(200).json({ token, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* LOGIN */
export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await UserData.findOne({ email });
    console.log(user.role);
    if (!user) {
      return res.status(401).send({ message: "Invalid emailID" });
    }

    // Validate Password
    const validPassword = await comparedPassword(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid password" });
    }

    // Generate token with user data including the role
    const token = createJWT({
      email: user.email,
      password: user.password,
      role: user.role,
    });

    res
      .status(200)
      .send({ token, role: user.role, user, message: "Login Successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User details route (GET - protected)
export const userGet=async (req, res) => {
    try {
        const user = await UserData.find();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //console.log(user);
        res.json( user );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user details route (PUT - protected)
export const userPut = async (req, res) => {
  try {
      const { username, email, password, role } = req.body;
      const userId = req.params.id; // Assuming 'id' is passed in the route parameters
      const user = await UserData.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.username = username;
      user.email = email;
      user.password = password;
      user.role = role;
      await user.save();
      console.log(user);
      res.json({ message: 'User details updated successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

// Delete user route (DELETE - protected)
export const userDelete = async (req, res) => {
  try {
      const userId = req.params.id; // Assuming 'id' is passed in the route parameters
      const user = await UserData.findByIdAndDelete(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};