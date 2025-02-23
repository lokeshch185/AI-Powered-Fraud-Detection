import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
    claim_id: {
        type: String,
        unique: true,
        required: false
    },
    name: {
        type: String,
        required: false
    },
    policy_start_date: {
        type: Date,
        required: true
    },
    claim_date: {
        type: Date,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    premium_amount: {
        type: Number,
        required: true
    },
    sum_assured: {
        type: Number,
        required: true
    },
    income: {
        type: Number,
        required: true
    },
    channel: {
        type: String,
        required: true
    },
    product_type: {
        type: String,
        enum: ["Health", "Non Par", "Pension", "Traditional", "ULIP", "Variable"]
    },
    nominee_relation: {
        type: String
    },
    premium_payment_mode: {
        type: String,
        enum: ['Monthly', 'Quarterly', 'Half-Yearly', 'Yearly']
    },
    holder_marital_status: {
        type: String,
        enum: ['Single', 'Married', 'Divorced', 'Widowed']
    },
    policy_term: Number,
    correspondence_city: String,
    correspondence_state: String,
    status: {
        type: String,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected']
    },
    risk_level: {
        type: String,
        default: 'Not Assigned',
        enum: ['Not Assigned', 'Low', 'Medium', 'High']
    },
    fraud_category: {
        type: String,
        default: 'Not Assigned',
        enum: ["Not Assigned","No Fraud", "Early Death Claim", "High Sum Assured Ratio", "Age-Based Risk", "Channel-Based Fraud", "Income Mismatch"]
    },
    comment: {
        type: String,
        default: ''
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Generate unique claim ID before saving
claimSchema.pre('save', async function (next) {
    if (!this.claim_id) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const count = await mongoose.model('Claim').countDocuments();
        this.claim_id = `CLM${year}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

export default mongoose.model('Claim', claimSchema);
