const mongoose = require("mongoose");

let schema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        
    },
    { collation: { locale: "en" } }
);

module.exports = mongoose.model("AdminInfo", schema);
