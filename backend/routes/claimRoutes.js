import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import moment from 'moment';
import Claim from '../models/Claim.js';
import axios from 'axios';
import { parse } from 'csv-parse';
import FormData from 'form-data';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Single claim entry
router.post('/single', async (req, res) => {
  try {
    console.log(req.body);
    // First save the claim to MongoDB
    const claim = new Claim(req.body);
    await claim.save();

    // Then send to Flask API for analysis
    try {
      const flaskResponse = await axios.post('http://127.0.0.1:5000/predict', {
        claim_id: claim.claim_id,
        age: claim.age,
        premium_amount: claim.premium_amount,
        sum_assured: claim.sum_assured,
        income: claim.income,
        policy_start_date: claim.policy_start_date.toISOString().split('T')[0],
        claim_date: claim.claim_date.toISOString().split('T')[0],
        channel: claim.channel,
        product_type: claim.product_type
      });

      console.log(flaskResponse.data);
      // Update claim with risk analysis
      const riskLevel = flaskResponse.data.confidence;
      const fraudCategory = flaskResponse.data.fraud_category;
      await Claim.findByIdAndUpdate(claim._id, { risk_level: riskLevel, fraud_category: fraudCategory });

      // Send combined response
      res.status(201).json({
        message: 'Claim created successfully',
        claim: {
          ...claim.toObject(),
          risk_level: riskLevel,
          fraud_category: fraudCategory
        },
        analysis: flaskResponse.data
      });

    } catch (flaskError) {
      // If Flask API fails, still return the saved claim
      console.error('Flask API Error:', flaskError);
      res.status(201).json({
        message: 'Claim created but risk analysis failed',
        claim,
        analysisError: flaskError.message
      });
    }

  } catch (error) {
    console.error('MongoDB Error:', error);
    res.status(400).json({
      message: 'Error creating claim',
      error: error.message
    });
  }
});

// CSV upload
router.post('/bulk', upload.single('file'), async (req, res) => {
  try {
    // Create form data for Flask API
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), {
      filename: req.file.originalname,
      contentType: 'text/csv',
    });

    // Send to Flask API first
    const flaskResponse = await axios.post('http://127.0.0.1:5000/bulk-predict', form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      responseType: 'arraybuffer'
    });

    // Convert Flask response to string
    const csvString = Buffer.from(flaskResponse.data).toString('utf-8');
    
    // Process the CSV string
    const results = [];
    const errors = [];
    const processedClaims = [];

    // Use csv-parse to handle the CSV string
    await new Promise((resolve, reject) => {
      parse(csvString, {
        columns: true,
        skip_empty_lines: true
      })
        .on('data', (data) => results.push(data))
        .on('error', reject)
        .on('end', async () => {
          try {
            // Save processed data to MongoDB
            for (const row of results) {
              try {
                const mappedData = {
                  claim_id: `CLM${Date.now()}`,
                  policy_start_date: moment(row.policy_start_date, "DD-MM-YYYY").toDate(),
                  claim_date: moment(row.claim_date, "DD-MM-YYYY").toDate(),
                  age: Number(row.age) || 0,
                  premium_amount: Number(row.premium_amount) || 0,
                  sum_assured: Number(row.sum_assured) || 0,
                  income: Number(row.income) || 0,
                  channel: row.channel || 'Unknown',
                  product_type: row.product_type || 'General',
                  status: 'Pending',
                  risk_level: row.risk_level || 'Not Assigned',
                  fraud_category: row.fraud_category || 'Not Assigned',
                  comment: ''
                };

                try {
                  const claim = new Claim(mappedData);
                  // console.log("Attempting to save claim:", claim);
                  const savedClaim = await claim.save();
                  // console.log("Saved claim successfully:", savedClaim);
                  processedClaims.push(savedClaim);
                } catch (saveError) {
                  console.error("Error saving claim:", saveError);
                  errors.push({
                    row,
                    error: `Save error: ${saveError.message}`,
                  });
                }
              } catch (rowError) {
                console.error("Error processing row:", rowError);
                errors.push({
                  row,
                  error: `Row processing error: ${rowError.message}`,
                });
              }
            }
            resolve(); // Resolve the promise after processing all rows
          } catch (mongoError) {
            console.error("MongoDB operation error:", mongoError);
            reject(mongoError);
          }
        });
    });

    // Send response only after all processing is complete
    res.json({
      message: 'CSV processed successfully',
      totalProcessed: results.length,
      successCount: processedClaims.length,
      errorCount: errors.length,
      errors,
      processedData: csvString
    });

  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(400).json({
      message: 'Error processing CSV',
      error: error.message,
    });
  } finally {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
  }
});

// Get all claims with pagination and filters
router.get('/', async (req, res) => {
  try {
    console.log(req.query);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filters = {};
    
    // Basic filters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.product_type) filters.product_type = req.query.product_type;
    if (req.query.risk_level) filters.risk_level = req.query.risk_level;

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filters.claim_date = {};
      if (req.query.startDate) {
        filters.claim_date.$gte = new Date(req.query.startDate);
      }
      if (req.query.endDate) {
        filters.claim_date.$lte = new Date(req.query.endDate);
      }
    }

    const claims = await Claim.find(filters)
      .sort({ claim_date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Claim.countDocuments(filters);
    // console.log(claims);

    res.json({
      claims,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(400).json({
      message: 'Error fetching claims',
      error: error.message
    });
  }
});

// Update claim status
router.patch('/:claimId/status', async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status, comment } = req.body;

    // Validate status
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status value'
      });
    }

    // Update the claim
    const updatedClaim = await Claim.findOneAndUpdate(
      { claim_id: claimId },
      { 
        status,
        comment,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    );

    if (!updatedClaim) {
      return res.status(404).json({
        message: 'Claim not found'
      });
    }

    res.json({
      message: 'Claim status updated successfully',
      claim: updatedClaim
    });

  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({
      message: 'Error updating claim status',
      error: error.message
    });
  }
});

export default router;