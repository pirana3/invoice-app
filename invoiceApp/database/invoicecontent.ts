import {db} from '@/database/db';

export type InvoiceContent = {
    id: number;
    invoicenumber: number;
    invoicedate: number;
    duedate: number;
    clientname: string;
    products: string;
    totalamount:number;
    percentage: number;
    tax: number;
    notes: string;
    termsandconditions: string;
    details: string;

};

export const createInvoiceContent = async (

)

