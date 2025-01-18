//정적 자격증명
const users = {
    "master" : { 
        password : "asdf",
        groups : ["system:masters"]
    },
    "user1" : {
        password : "asdf",
        groups : ["users"],
    },
    "user2" : {
        password: "asdf",
        groups : ["managers", "users"]
    }
}

module.exports = users;