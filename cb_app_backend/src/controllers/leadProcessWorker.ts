import Bull from 'bull';
import fs from 'fs';
import csvParser from 'csv-parser';
import { LeadDataSource, Lead } from '../models/leadModel';

const leadProcessingQueue = new Bull('lead-processing');

leadProcessingQueue.process(async (job) => {
  const { csvFilePath, jsonFilePath, leadsDataSourceId, userId } = job.data;
  const results = [];

  await new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', resolve)
      .on('error', reject);
  });

  // Write JSON file
  fs.writeFileSync(jsonFilePath, JSON.stringify(results));

  // Create Lead documents
  const leadPromises = results.map(async (leadData) => {
    const lead = await Lead.create({
      ...leadData,
      user: userId,
      dataSource: leadsDataSourceId,
    });
    return lead._id;
  });

  const leadIds = await Promise.all(leadPromises);

  // Update LeadDataSource with created leads
  await LeadDataSource.findByIdAndUpdate(leadsDataSourceId, {
    $push: { leads: { $each: leadIds } },
  });

  // Optionally, delete the CSV file
  fs.unlinkSync(csvFilePath);

  return { processedLeads: leadIds.length };
});
