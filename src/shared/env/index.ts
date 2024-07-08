const NODE_ENV: string = process.env['NODE_ENV'] || 'development';
const DOMAIN: string = process.env['DOMAIN'] || 'localhost';
const PORT: number = +process.env['PORT'] || 1010;

export { NODE_ENV, DOMAIN, PORT };
