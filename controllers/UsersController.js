import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import Queue from 'bull';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';


class UsersController{
    static async postNew(req, res){
        const { name, email, password } = req.body;

        if (!email){
            return res.status(400).json({ error: 'Missing email'})
        }

        if (!password){
            return res.status(400).json({ error: 'Missing password'})
        }
        
        try {
            const userCollection = await dbClient.collection('users');
            const existingUser = await userCollection.findOne('email');

            if (existingUser) {
                return res.status(400).json({ error: 'Already exist'});
            }

            const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
            const newUser = await usersCollection.insertOne({ email, password: hashedPassword });

            return res.status(201).json({ email: newUser.email, id: newUser._id });
        } catch (error){
            console.error('Error creating user:', error);
                        return res.status(500).json({ error: 'Internal Server Error'});
        }
    }
}

module.exports = UsersController;
