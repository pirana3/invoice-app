import {db} from '@/database/db';

export type InvoiceContent = {
    id: number;
    invoicenumber: number;
    invoicedate: number;
    clientname: string;
    products: string;
    totalamount:number;
    percentage: number;
    tax: number;
    notes: string;
    termsandconditions: string;
    details: string;

};

export const updateInvoice = async(
    id: number,
    invoicenumber: number,
    invoicedate: number,
    clientname: string,
    products: string,
    totalamount:number,
    percentage: number,
    tax: number,
    notes: string,
    termsandconditions: string,
    details: string
): Promise<boolean> =>{
    const invoiceinfo = db.runSync(
        `UPDATE createinvoces SET invoicenumber = ?, invoicedate = ?, clientname = ?, products = ?, totalamount = ?, percentage = ?, tax = ?, notes = ?, termsandconditions = ?, details = ? WHERE id = ?`,
        invoicenumber,
        invoicedate,
        clientname,
        products,
        totalamount,
        percentage,
        tax,
        notes,
        termsandconditions,
        details,
        id
    );
    return invoiceinfo.changes > 0;
};
