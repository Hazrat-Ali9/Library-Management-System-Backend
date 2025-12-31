
import { Types } from "mongoose";
import { BaseDocument } from "./book.interfaces";



export interface IBorrow extends BaseDocument{
    book: Types.ObjectId;
    quantity: number;
    dueDate: Date;
}
