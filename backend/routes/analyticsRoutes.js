import express from 'express';
import Claim from '../models/Claim.js';
const router = express.Router();

router.get('/dashboard-stats', async (req, res) => {
  try {
    // Get total claims count
    const totalClaims = await Claim.countDocuments();
    
    // Get claims by status
    const claimsByStatus = await Claim.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Get claims by risk level
    const claimsByRisk = await Claim.aggregate([
      { $group: { _id: "$risk_level", count: { $sum: 1 } } }
    ]);

    // Get fraud categories distribution
    const fraudDistribution = await Claim.aggregate([
      { $group: { _id: "$fraud_category", count: { $sum: 1 } } }
    ]);

    // Get monthly trend (last 6 months)
    const monthlyTrend = await Claim.aggregate([
      {
        $match: {
          claim_date: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$claim_date" },
            year: { $year: "$claim_date" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          year: "$_id.year",
          count: 1
        }
      },
      {
        $sort: { 
          year: 1, 
          month: 1 
        }
      }
    ]);

    // Get product type distribution
    const productDistribution = await Claim.aggregate([
      { $group: { _id: "$product_type", count: { $sum: 1 } } }
    ]);

    // Calculate high-risk claims
    const highRiskClaims = await Claim.countDocuments({ risk_level: "High" });

    const recentClaims = await Claim.find()
      .sort({ claim_date: -1 })
      .limit(10);

    const pendingClaims = await Claim.countDocuments({ status: 'Pending' });
    const approvedToday = await Claim.countDocuments({
      status: 'Approved',
      updated_at: {
        $gte: new Date().setHours(0, 0, 0, 0)
      }
    });

    res.json({
      totalClaims,
      claimsByStatus,
      claimsByRisk,
      fraudDistribution,
      monthlyTrend,
      productDistribution,
      highRiskClaims,
      recentClaims,
      pendingClaims,
      approvedToday
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;