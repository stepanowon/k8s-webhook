const https = require('https');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 사용자 인증 정보 (예시)
const users = {
    'admin': { password: 'asdf', uid: "1001", groups: ["system:masters"] },
    'user1': { password: 'asdf', uid: "1002", groups: ["users"] },
    'user2': { password: 'asdf', uid: "1003", groups: ["managers"] },
};

app.get("/", (req,res)=> {
    res.send("<h1>Hello Auth!!</h1>");
});

// Basic Authentication 웹훅 핸들러
app.post('/authenticate', (req, res) => {
    const { apiVersion, kind, spec } = req.body;
    console.log(req.body);

    if (apiVersion !== 'authentication.k8s.io/v1' || kind !== 'TokenReview') {
        return res.status(400).json({ error: 'Invalid request' });
    }

    const token = spec.token;
    const credentials = Buffer.from(token, 'base64').toString('utf-8');
    const [username, password] = credentials.split(':');
    console.log("## credentials : " + credentials);
    console.log("##username : "+username);
    console.log("##password : "+password);

    if (users[username] && users[username].password  === password) {
        return res.json({
            apiVersion: 'authentication.k8s.io/v1',
            kind: 'TokenReview',
            status: {
                authenticated: true,
                user: {
                    username: username,
                    uid: username + "-uid",
                    groups: users[username].groups,
                }
            }
        });
    } else {
        return res.json({
            apiVersion: 'authentication.k8s.io/v1',
            kind: 'TokenReview',
            status: {
                authenticated: false
            }
        });
    }
});

// HTTPS 서버 설정
const options = {
  key: fs.readFileSync("./certs/server.key"),
  cert: fs.readFileSync("./certs/server.crt"),
  ca: fs.readFileSync("./certs/ca.crt"),
};

const PORT = 8443
https.createServer(options, app).listen(PORT, () => {
    console.log(`HTTPS Webhook server is running on port ${PORT}`);
});
