import { BigQuery } from "@google-cloud/bigquery";
import { app } from "../config";
import { logger } from "../utils/logger";

class BigQueryService {
    public bigQuery!: BigQuery;

    constructor() {
        try {
            this.bigQuery = new BigQuery({
                projectId: app.bigQuery.googleProjectId,
                keyFilename: app.bigQuery.googleAppCreds
            });
        } catch (err) {
            logger.error(`Error creating BigQuery instance:`, err);
        }
    }

    async uploadToBigQuery(data: { rows: any[], dataset: string, table: string }) {
        try {
            if (this.bigQuery != null) {
                const dataset = this.bigQuery.dataset(data.dataset);
                const table = dataset.table(data.table);

                // Chunk the data to avoid "Request Entity Too Large" errors
                const CHUNK_SIZE = 100;
                const chunks = this.chunkArray(data.rows, CHUNK_SIZE);
                
                console.log(`Uploading ${data.rows.length} rows in ${chunks.length} chunks of ${CHUNK_SIZE}`);
                
                for (let i = 0; i < chunks.length; i++) {
                    try {
                        // Log sample data for debugging
                        if (i === 0) {
                            console.log(`Sample data structure:`, JSON.stringify(chunks[i][0], null, 2));
                        }
                        
                        await table.insert(chunks[i]);
                        console.log(`Uploaded chunk ${i + 1}/${chunks.length} (${chunks[i].length} rows)`);
                    } catch (chunkError) {
                        logger.error(`Error uploading chunk ${i + 1}/${chunks.length}:`, chunkError);
                        console.error(`Failed chunk data sample:`, JSON.stringify(chunks[i][0], null, 2));
                        throw chunkError; 
                    }
                }
            }
        } catch (err) {
            logger.error(`Error inserting rows to ${data.table} table`, err);
            throw err; 
        }
    }

    private chunkArray<T>(array: T[], chunkSize: number): T[][] {
        const chunks: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }
}

export { BigQueryService };