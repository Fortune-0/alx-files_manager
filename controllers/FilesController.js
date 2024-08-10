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

        if (type !== 'folder' && !data) {
            return res.status(400).json({ error: 'Missing data' });
        }

        let parentFile = null;
        if (parentFile !== 0) {
            parentFile = await dbClient.collection('files').findOne({_id: 'parentId'})
            if (!parentFile) {
                return res.status(400).json({ error: 'Invalid parent folder' });
            }

            if (parentFile.type !== 'folder') {
                return res.status(400).json({ error: 'Parent folder must be a folder' });
            }
        }

        const newFile = {
            userId,
            name,
            type,
            isPublic,
            parentId,
            localPath,
        }

        if (type === 'folder') {
            const result = await dbClient.collection('files').insertOne(newFile);
            return res.status(201).json(result.ops[0]);
        }

        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        await fsPromises.mkdir(folderPath, { recursive: true });

        const localPath = path.join(folderPath, uuidv4());
        await fsPromises.writeFile(localPath, Buffer.from(data, 'base64'));

        newFile.localPath = localPath;

        const result = await dbClient.collection('files').insertOne(newFile);
        return res.status(201).json(result.ops[0]);
    }
}

module.exports = FilesController;
