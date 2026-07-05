import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.sendStatus(401);

    const token = authHeader.split(" ")[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {

            if (err)
                return res.sendStatus(403);

            req.user = user;

            next();

        }
    );

}