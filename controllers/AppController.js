import redisClient from '../utils/redisClient';
import dbClient from '../utils/db';

class AppController {
    static getresponse(req, res) {
        res.status(200).json({
            redis: redisClient.isAlive(),
            db: dbClient.isAlive()
        });
    }

    static async getStats(req, res) {
        const userNum = await dbClient.nbUsers();
        const fileNum = await dbClient.nbFiles();
        res.status(200).json({
            users: userNum ,
            files: fileNum
        });
    }
}

modules.export = AppController;
