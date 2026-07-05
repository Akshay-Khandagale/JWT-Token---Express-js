import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import verifyToken from "../middleware/verifyToken.js";

dotenv.config();

const router = express.Router();

// Store refresh tokens (Use DB in production)
let refreshTokens = [];

/*
Login
*/
router.post("/login", (req, res) => {

    const { username } = req.body;

    // Suppose user already verified
    const user = {
        id: 1,
        username: username
    };

    // Access Token
    const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    );

    // Refresh Token
    const refreshToken = jwt.sign(
        user,
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );

    refreshTokens.push(refreshToken);

    res.json({
        accessToken,
        refreshToken
    });

});

/*
Protected Route
*/

router.get("/profile", verifyToken, (req, res) => {

    res.json({
        message: "Welcome",
        user: req.user
    });

});


/*
Refresh Token
*/

router.post("/refresh", (req, res) => {

    const { refreshToken } = req.body;

    if (!refreshToken)
        return res.sendStatus(401);

    if (!refreshTokens.includes(refreshToken))
        return res.sendStatus(403);

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {

            if (err)
                return res.sendStatus(403);

            const accessToken = jwt.sign(
                {
                    id: user.id,
                    username: user.username
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "15m"
                }
            );

            res.json({
                accessToken
            });

        }
    );

});


/*
Logout
*/

router.post("/logout", (req, res) => {

    const { refreshToken } = req.body;

    refreshTokens = refreshTokens.filter(
        token => token !== refreshToken
    );

    res.json({
        message: "Logged Out"
    });

});

export default router;