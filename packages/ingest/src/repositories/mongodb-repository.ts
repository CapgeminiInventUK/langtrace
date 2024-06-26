import { Db, MongoClient, UpdateResult } from 'mongodb';
import 'dotenv/config';
import { CreateFeedback, UpdateFeedback, TraceData } from '@langtrace/models';

export class MongodbRepository {
  private db!: Db;

  private collectionName = process.env.LANGTRACE_TRACES_MONGODB_COLLECTION_NAME!;

  constructor() {
    const api = process.env.LANGTRACE_INGEST_MONGODB_URI!;
    const client = new MongoClient(api);

    client.connect().then(() => {
      this.db = client.db(process.env.LANGTRACE_MONGODB_DB_NAME);
    }).catch(error => {
      console.error('Failed to connect to MongoDB', error);
    });
  }

  async insertTrace(langtraceData: TraceData): Promise<void> {
    const collection = this.db.collection(this.collectionName);
    await collection.insertOne(langtraceData);
  }

  async updateTrace(langtraceId: string, updateData: TraceData): Promise<UpdateResult> {
    const collection = this.db.collection(this.collectionName);
    return collection.updateOne({ run_id: { $eq: langtraceId } }, { $set: { ...updateData } });
  }

  async insertFeedbackOnTraceByRunId(feedback: CreateFeedback) {
    const collection = this.db.collection(this.collectionName);
    await collection.updateOne({ run_id: { $eq: feedback.run_id } }, { $set: { feedback } });
  }

  async updateFeedbackOnTraceByFeedbackId(
    feedbackId: string,
    feedbackData: UpdateFeedback):
    Promise<UpdateResult> {
    const collection = this.db.collection(this.collectionName);

    const setOperation: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(feedbackData)) {
      setOperation[`feedback.${key}`] = value;
    }

    return await collection.updateOne({ 'feedback.id': feedbackId },
      { $set: setOperation });
  }
}
