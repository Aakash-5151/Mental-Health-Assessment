require('dotenv').config();
const bcrypt = require("bcrypt")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const JWT_SECRET = "mindcare_secret_key"

const app = express()

// ============================
// MIDDLEWARE
// ============================

app.use(cors())
app.use(express.json())


function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"]

    const token = authHeader && authHeader.split(" ")[1]

    if (!token) {

        return res.status(401).json({
            message: "Access denied"
        })

    }

    jwt.verify(token, JWT_SECRET, (err, user) => {

        if (err) {

            return res.status(403).json({
                message: "Invalid token"
            })

        }

        req.user = user

        next()

    })

}
// ============================
// DATABASE CONNECTION
// ============================

mongoose.connect("mongodb://127.0.0.1:27017/mindcare")
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("Database error:", err))

// ============================
// MODELS
// ============================

const User = mongoose.model("User", new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    }

}))

const Mood = mongoose.model("Mood", new mongoose.Schema({

    mood: String,
    energy: String,
    notes: String,

    created: {
        type: Date,
        default: Date.now
    }

}))

const Stress = mongoose.model("Stress", new mongoose.Schema({

    score: Number,
    result: String,

    created: {
        type: Date,
        default: Date.now
    }

}))

// ============================
// REGISTER USER
// ============================

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {

            return res.json({
                success: false,
                message: "User already exists"
            })

        }

        // HASH PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })

        await newUser.save()

        res.json({
            success: true,
            message: "Registration successful"
        })

    } catch (error) {

        res.json({
            success: false,
            message: "Server error"
        })

    }
})
// ============================
// LOGIN USER
// ============================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body

        const user = await User.findOne({ email })

        if (!user) {

            return res.json({
                success: false,
                message: "Invalid email or password"
            })

        }

        const match = await bcrypt.compare(password, user.password)

        if (!match) {

            return res.json({
                success: false,
                message: "Invalid email or password"
            })

        }

        // CREATE TOKEN

        const token = jwt.sign(

            { userId: user._id },

            JWT_SECRET,

            { expiresIn: "7d" }

        )

        res.json({
            success: true,
            message: "Login successful",
            token: token,
            user: {
                name: user.name,
                email: user.email
            }

        })

    } catch (error) {
        console.error("Login route error:", error);
        res.json({
            success: false,
            message: "Server error: " + error.message
        })

    }
})
// ============================
// SAVE MOOD ENTRY
// ============================

app.post("/mood", async (req, res) => {

    try {

        const { mood, energy, notes } = req.body

        const newMood = new Mood({
            mood,
            energy,
            notes
        })

        await newMood.save()

        res.json({
            success: true,
            message: "Mood saved successfully"
        })

    } catch (error) {

        res.json({
            success: false,
            message: "Error saving mood"
        })

    }

})


// ============================
// GET MOOD HISTORY
// ============================

app.get("/moods", async (req, res) => {

    try {

        const moods = await Mood.find().sort({ created: -1 })

        res.json({
            success: true,
            data: moods
        })

    } catch (error) {

        res.json({
            success: false,
            message: "Error fetching moods"
        })

    }

})


// ============================
// SAVE STRESS RESULT
// ============================

app.post("/stress", async (req, res) => {

    try {

        const { score, result } = req.body

        const newStress = new Stress({
            score,
            result
        })

        await newStress.save()

        res.json({
            success: true,
            message: "Stress result stored"
        })

    } catch (error) {

        res.json({
            success: false,
            message: "Error saving stress data"
        })

    }

})


// ============================
// GET STRESS HISTORY
// ============================

app.get("/stress-history", async (req, res) => {

    try {

        const stressData = await Stress.find().sort({ created: -1 })

        res.json({
            success: true,
            data: stressData
        })

    } catch (error) {

        res.json({
            success: false,
            message: "Error fetching stress history"
        })

    }

})


// ============================
// SERVER START
// ============================

if (!process.env.HF_TOKEN) {
  console.error("HF_TOKEN environment variable not set. Please set it to your Hugging Face API token.");
  process.exit(1);
}

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const detectEmotion = require("./emotionService");

app.post("/chat", async (req, res) => {

  const userMessage = req.body.message;

  const emotion = await detectEmotion(userMessage);

  res.json({
    message: userMessage,
    emotion: emotion
  });

});