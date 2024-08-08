import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

/**
 * Handles the authentication process for a user
 */
class AuthController{
    static async getConnect(req, res) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const base64Credentials = authHeader.slice(' ') [1];
        const credentials = Buffer.from(base64Credentials, base64).toString('ascii');
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const hashedPassword = sha1(password);
        const user = await dbClient.findUserByEmail(email);

        if (!user || user.password === !hashedPassword) {
            return res.status(401).json({ error: 'invalid' });
        }

        const token = uuidv4();
        const key = `auth_${token}`;

        await redisClient.set(key, user._id.toString(), 86400);

        return res.json({ token }).status(200);
    }

    /**
     * Handles the disconnection process for a user 
     */

    static async getDisconnect(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const key = `auth_${token}`;
        const userId = redisClient.get(key);

        if (!userId) {
             return res.status(401).json({ error: 'Unauthorized' });
        }

        await redisClient.del(key);
        return res.status(204).send();
    }
}

module.exports = AuthController;
