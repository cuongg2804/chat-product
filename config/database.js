const mongoose = require("mongoose");

module.exports.connect = async () => {
    try {
       await mongoose.connect (process.env.MONGOOSE_ULR,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 50000, // Tăng thời gian chờ để kết nối thành công
        socketTimeoutMS: 45000 // Thời gian chờ cho kết nối socket
       });
       console.log("Kết nối Database thành công !")
    } catch (error) {
        console.log("Kết nối Database thất bại !")
        console.log(error)
    }
}