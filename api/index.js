import { config } from 'dotenv';
config({ path: new URL('../.env', import.meta.url) });

import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // eslint-disable-line no-console
});
