import {createServer} from "node:http";
import {PORT} from "./config/userServerConfig.ts";
import {userRouters} from "./routers/userRoutes.ts";
import {UserController} from "./controllers/UserController.ts";
import {UserServiceEmbeddedImpl} from "./service/UserServiceEmbeddedImpl.ts";
import {myLogger} from "./utils/logger.ts";

export const launchServer = () => {
    const userService = new UserServiceEmbeddedImpl();
    userService.restoreDataFromFile();
    const userController:UserController = new UserController(userService);

    createServer(async (req, res) => {
      await userRouters(req, res, userController) ;
    }).listen(PORT, () => {
        console.log(`UserServer runs at http://localhost:${PORT}`)
    })

    process.on('SIGINT', async () => {
        await userService.saveToFile()
        myLogger.log('Saving...');
        myLogger.saveToFile('Server was stopped by Ctrl+C');
        process.exit(0);
    })
}