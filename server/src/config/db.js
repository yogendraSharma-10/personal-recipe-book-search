const mongoose = require('mongoose');

/**
 * @function connectDB
 * @description Establishes a connection to the MongoDB database using Mongoose.
 *              It retrieves the MongoDB URI from environment variables.
 *              Logs connection status and exits the process on failure.
 */
const connectDB = async () => {
  try {
    // Mongoose 6.x and later versions handle connection options internally.
    // Setting `strictQuery` to `true` prepares for Mongoose 7's default behavior,
    // ensuring that only fields defined in the schema can be queried.
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;