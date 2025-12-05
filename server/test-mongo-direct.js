import 'dotenv/config';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI);

async function run() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('Connected!');

        const db = client.db();
        const collection = db.collection('users');

        console.log('Inserting...');
        const result = await collection.insertOne({
            name: 'Direct Mongo Test',
            email: 'direct@test.com',
            password: 'hashedpassword'
        });
        console.log('Inserted:', result.insertedId);
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

run();
