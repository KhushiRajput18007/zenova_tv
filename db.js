// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://khushirajputcg:tH5N8A9faAPcM8Np@cluster0.cxpuc.mongodb.net/ZenovaTV?retryWrites=true&w=majority&appName=Cluster0", 
      {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    );
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;