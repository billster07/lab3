"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const client = new pg_1.Client({
    connectionString: process.env.PGURI,
});
client.connect();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.static(path_1.default.join(path_1.default.resolve(), "dist")));
const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOption));
app.use(express_1.default.json());
let sessionToken;
let options = {
    // maxAge: 1000 * 60 * 15, // would expire after 15 minutes
    httpOnly: true, // The cookie only accessible by the web server
    expire: "",
};
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user = null;
    try {
        if (req.cookies.token) {
            if (req.cookies.token.length > 1) {
                const { rows } = yield client.query("SELECT user_id FROM tokens WHERE token=$1", [req.cookies.token]);
                user = rows[0].user_id;
            }
        }
        else if (sessionToken) {
            const { rows } = yield client.query("SELECT user_id FROM tokens WHERE token=$1", [sessionToken]);
            user = rows[0].user_id;
        }
        if (!user) {
            res.status(401).send("Unauthorized");
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).send("Unauthorized");
    }
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const { rows } = yield client.query(`SELECT * FROM users WHERE username=$1 AND password=$2`, [username, password]);
        if (rows.length === 1) {
            const userId = rows[0].id;
            const token = (0, uuid_1.v4)();
            sessionToken = token;
            yield client.query("INSERT INTO tokens VALUES ($1, $2)", [userId, token]);
            res
                .cookie("token", token, options)
                .status(201)
                .send({ token: token, user_id: userId });
        }
        else {
            res.status(401).send("Unauthorized");
        }
    }
    catch (error) {
        console.error(error);
    }
}));
app.post("/logout", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.query("DELETE FROM tokens WHERE token=$1", [req.body.token]);
    options.expire = new Date("2020-01-01");
    res.cookie("token", "", options).status(200).send("OK");
    sessionToken = null;
    req.user = null;
}));
app.get("/user", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield client.query("SELECT token FROM tokens WHERE user_id=$1", [req.user]);
        res.status(200).send({ token: token, user_id: req.user });
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request");
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield client.query("SELECT * FROM users");
        res.status(200).send(rows);
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request");
    }
}));
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query("INSERT INTO users (username, password, phone_number) VALUES ($1, $2, $3)", [req.body.username, req.body.password, req.body.phone_number]);
        res.status(201).send();
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request");
    }
}));
app.get("/matches", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield client.query("SELECT new_table.id, home_team, team AS away_team, goals_home, goals_away, stage, match_date, kick_off, new_table.groups FROM (SELECT matches.id AS id, team AS home_team, away_team, goals_home, goals_away, stage, date AS match_date, kick_off, teams.groups FROM matches INNER JOIN teams ON matches.home_team = teams.id ORDER BY matches.last_bet) AS new_table INNER JOIN teams ON new_table.away_team = teams.id");
        res.status(200).send(rows);
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request");
    }
}));
app.post("/matches", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.query("UPDATE matches SET goals_home=$1, goals_away=$2 WHERE id=$3", [req.body.goals_home, req.body.goals_away, req.body.match_id]);
        res.status(201).send("Created");
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad Request");
    }
}));
app.get("/teams", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield client.query("SELECT * FROM teams");
        res.status(200).send(rows);
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request");
    }
}));
app.get("/bets", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield client.query("SELECT * FROM bets WHERE user_id=$1", [
            req.user,
        ]);
        res.status(200).send(rows);
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad request");
    }
}));
app.post("/bets", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield client.query("SELECT * FROM matches WHERE id=$1", [
            req.body.match_id,
        ]);
        const { rows: alreadyExist } = yield client.query("SELECT * FROM bets WHERE match_id=$1 AND user_id=$2", [req.body.match_id, req.user]);
        let last_bet;
        if (rows.length === 1) {
            last_bet = new Date(rows[0].last_bet);
        }
        const event = new Date();
        if (last_bet && event > last_bet) {
            res.status(403).send("Last bet passed");
        }
        else if (alreadyExist.length === 1 &&
            alreadyExist[0].result !== req.body.result) {
            yield client.query("UPDATE bets SET result=$1, date=$4 WHERE match_id=$2 AND user_id=$3", [req.body.result, req.body.match_id, req.user, event]);
        }
        else if (alreadyExist.length > 0) {
            res.status(403).send("Already exist");
        }
        else {
            yield client.query("INSERT INTO bets (user_id, match_id, result) VALUES ($1, $2, $3)", [req.user, req.body.match_id, req.body.result]);
            res.status(201).send("OK");
        }
    }
    catch (error) {
        console.error(error);
    }
}));
app.get("/leaderboard", authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { rows } = yield client.query("SELECT new_table.id, username, match_id, result AS user_result, goals_home, goals_away FROM (SELECT id, username, match_id, result FROM users INNER JOIN bets on users.id = bets.user_id) AS new_table INNER JOIN matches ON new_table.match_id = matches.id");
        res.status(200).send(rows);
    }
    catch (error) {
        console.error(error);
        res.status(400).send("Bad Request");
    }
}));
app.listen(port, () => {
    console.log(`Webbtjänsten kan nu ta emot anrop på http://localhost:${port}`);
});
