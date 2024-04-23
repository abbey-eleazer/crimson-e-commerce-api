
const mongoose = require("mongoose")

const db_connection = () => {
	
	mongoose.connect(process.env.MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			dbName: 'crimson_e-commerce'
		})
		.then(() => {
			console.log("MongoDB Connection Succeeded.".bgGreen)
		})
		.catch((error) => {
			console.log("Error in DB connection: " + error)
		})
}

module.exports = db_connection