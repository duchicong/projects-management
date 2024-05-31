import { join } from 'path';
import express from 'express';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const viewEngine = (app: any, dirname = __dirname) => {
    if (!app) return;
    app.set('views', join(dirname, 'views'))
    app.set('view engine', 'ejs')

    // config static files
    app.use(express.static(join(dirname, 'public')))
}

export default viewEngine;