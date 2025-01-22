const bcrypt = require("bcryptjs");
const admins = [
  {
    name: {
      pt: "Admin",
    },
    image: "https://i.ibb.co/WpM5yZZ/9.png",
    email: "admin@gmail.com",
    password: bcrypt.hashSync("@#123gki&$nbP"),
    phone: "360-943-7332",
    role: "Admin",
    joiningData: new Date(),
  },
];

module.exports = admins;
