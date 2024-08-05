const { MongoClient } = require('mongodb');

class DBClient {
    constructor(){
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || 27017;
        const database = process.env.DB_DATABASE || 'files_manager';
        const url = `mongodb://${host}:${port}`;

        this.client = new MongoClient(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        this.client.connect().catch(console.error);
        this.dbName = database;
    }

    async isAlive() {
        try {
            await this.client.db().command({ ping: 1 });
            return true;
        } catch (e) {
            return false;
        }
    }

    async nbUsers() {
        try {
            return await this.db.collection('users').countDocuments();
        } catch (error) {
            console.error('Error counting users:', error);
            return 0;
        }
    }

    async nbFiles() {
        try {
            return await this.db.collection('files').countDocuments();
        } catch (error) {
            console.error('Error counting files:', error);
            return 0;
        }
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
