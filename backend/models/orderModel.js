import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    items: { type: Array, required: true },
    address: { type: Object, required: true },
    status: { type: String, required: true, default:'Order Placed' },
    date: {type: Number, required:true},
    payment: {
        method: { type: String }, // 'COD' | 'Stripe' | 'Razorpay' | 'BankTransfer'
        transactionId: { type: String },
        amount: { type: Number }
    },
    bankStatement: { type: String } // path or URL to uploaded bank statement image/file
})

const orderModel = mongoose.models.order || mongoose.model('order',orderSchema)
export default orderModel;