import App from './app';
import LoggerConfig from './config/loggerConfig';

import dotenv from 'dotenv';

function startServer() {
    dotenv.config();
    const logger = new LoggerConfig().logger;

    const app = new App(logger).app;

    const PORT = process.env.PORT;

    app.listen(PORT, () => {
        logger.info(`Server listening on port ${PORT}`);
    });
}

startServer();