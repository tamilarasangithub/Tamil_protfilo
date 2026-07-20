import app from './server.js';
import dotenv from 'dotenv';

// Load environment variables from the root .env file
dotenv.config({ path: '../.env' });

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
