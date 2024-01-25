import { TraceData } from '../models/requests/trace_request';
import { CreateFeedback, UpdateFeedback } from '../models/requests/feedback_request';
import { IngestRepository } from '../repositories/ingest_repository';

export class LangchainToLangtraceService {
  private repository: IngestRepository;

  constructor() {
    this.repository = new IngestRepository();
  }

  private convertToDates(data: TraceData): void {
    if (data.start_time) {
      data.start_time = new Date(data.start_time);
    }
    if (data.end_time) {
      data.end_time = new Date(data.end_time);
    }
  }

  async createTrace(langchainData: TraceData): Promise<string> {
    if (!langchainData.id) {
      throw new Error('id is required in data');
    }
    langchainData.run_id = langchainData.id;
    delete langchainData.id;

    this.convertToDates(langchainData);

    await this.repository.insertTrace(langchainData);
    return langchainData.run_id;
  }

  async updateTrace(trace_id: string, langchainData: TraceData): Promise<boolean> {
    this.convertToDates(langchainData);

    const updateResult = await this.repository.updateTrace(trace_id, langchainData);
    return updateResult.matchedCount > 0;
  }

  async createFeedback(feedback: CreateFeedback) {
    if (!feedback.run_id) {
      throw new Error('run_id is required in data');
    }

    await this.repository.insertFeedbackOnTraceByRunId(
      feedback
    );
    return feedback.id;
  }

  async updateFeedback(feedbackId: string, feedbackData: UpdateFeedback): Promise<boolean> {
    return (
      await this.repository.updateFeedbackOnTraceByFeedbackId(
        feedbackId,
        feedbackData
      )
    ).matchedCount > 0;
  }
}
