const mongoose = require('mongoose');

const mongoURI = process.env.MONGO_URI;

const mongoDB = async () => {
  if (!mongoURI) {
    throw new Error('MONGO_URI is not configured. Add it to your environment variables.');
  }

  await mongoose.connect(mongoURI);
  console.log('MongoDB connected');

  const fetchedData = await mongoose.connection.db.collection('food_items').find({}).toArray();
  const foodCategory = await mongoose.connection.db.collection('foodCategory').find({}).toArray();

  global.food_items = fetchedData;
  global.foodCategory = foodCategory;
  console.log(`Loaded ${fetchedData.length} food items and ${foodCategory.length} categories`);
};

module.exports = mongoDB;
