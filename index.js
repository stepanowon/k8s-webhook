const express = require('express');
const os = require('os');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

var path = require('path');
var baseDir = path.resolve('.');

app.use(cors());
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

app.set('port', (process.env.PORT || 8080));
app.use(express.static(baseDir + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('port', (process.env.PORT || 8080));

const externalAuth = (tokenReview) => {
    let [userid, passwd] = tokenReview.spec.token.split(':');
    
    let status = {};
    status.authenticated =  true;
    status.user = {
       username: userid,
       uid: userid,
       groups: ['system:masters']
    }
    return status;
} 
 
app.post("/", function(req, res) {
    let tokenReview = req.body;
    console.log(tokenReview);

    tokenReview.status = externalAuth(tokenReview);
    res.json(tokenReview);
});

app.listen(app.get('port'), function() {
    console.log("web hook server가 " + app.get('port') + "번 포트에서 시작되었습니다!");
});

