import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import { ObjectID } from 'mongodb';
import mime from 'mime-types';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class FilesController {
    static async postUpload(req, res) {
        const token = req.headers['x-token'];
        if (!token) {
            return res.status(401).json({ error: 'Missing token' });
        }

        const key = `auth_${token}`;
        const userId = await redisClient.get(key);
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { name, type, parentId = 0, isPublic = false, data} = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Missing name' });
        }

        const validTypes = ['folders', 'files', 'image'];
        if (!type || validTypes.includes(type)) {
            return res.status(400).json({ error: 'Missing type' });
        }
    }
}