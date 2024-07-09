import 'dotenv/config'


const NODE_ENV: string = process.env['NODE_ENV'] || 'development';
const DOMAIN: string = process.env['DOMAIN'] || 'localhost';
const PORT: number = +process.env['PORT'] || 1010;
const API_DOCKS: string = process.env['API_DOCKS'] || 'http://localhost:1010/docs';

const MOCK_APP_URLS = [
  API_DOCKS,
  'http://localhost:5173', // vite
  'http://localhost:3000', // react
];

export { NODE_ENV, DOMAIN, PORT, MOCK_APP_URLS };
