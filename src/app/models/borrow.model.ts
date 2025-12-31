import { Schema, model } from 'mongoose';
import { IBorrow } from '../interfaces/borrow.interface';


const borrowSchema = new Schema<IBorrow>({
    book: { 
        type: Schema.Types.ObjectId, 
        ref: 'Book', 
        required: true 
    },
    quantity: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    dueDate: { 
        type: Date, 
        required: true 
    }
}, { timestamps: true });

borrowSchema.post('save', async function (doc) {
  console.log(`Book borrowed: ${doc.book} | Quantity: ${doc.quantity}`);
});

export const Borrow = model<IBorrow>('Borrow', borrowSchema);

