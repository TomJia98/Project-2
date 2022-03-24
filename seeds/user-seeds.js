const { User } = require('../models');

const userData = [
    {
        username: "Godzilla",
        password: "banana01"
    },
    {
        username: "monkeyking",
        password: "banana02"
    },
    {
        username: "Darkknight",
        password: "banana03"
    },
    {
        username: "Joker",
        password: "banana04"
    },
    {
        username: "Chimpanzee",
        password: "banana05"
    },
    {
        username: "tigerking",
        password: "banana06"
    }
]

const seedUsers = () => User.bulkCreate(userData);

module.exports = seedUsers;