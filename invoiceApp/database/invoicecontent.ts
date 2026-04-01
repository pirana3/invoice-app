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
    completed: number;

};

export const createInvoice = async (
    invoicenumber: number,
    invoicedate: number,
    clientname: string,
    products: string,
    totalamount:number,
    percentage: number,
    tax: number,
    notes: string,
    termsandconditions: string,
    details: string,
    completed: number = 0
): Promise<number> => {
    const result = db.runSync(
        `INSERT INTO createinvoices (invoicenumber, invoicedate, clientname, products, totalamount, percentage, tax, notes, termsandconditions, details, completed)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        completed
    );
    return result.lastInsertRowId;
};

export const getInvoices = async (): Promise<InvoiceContent[]> => {
    return db.getAllSync<InvoiceContent>(
        `SELECT id, invoicenumber, invoicedate, clientname, products, totalamount, percentage, tax, notes, termsandconditions, details, completed
         FROM createinvoices ORDER BY id DESC`
    );
};

export const getInvoiceById = async (id: number): Promise<InvoiceContent | null> => {
    return db.getFirstSync<InvoiceContent>(
        `SELECT id, invoicenumber, invoicedate, clientname, products, totalamount, percentage, tax, notes, termsandconditions, details, completed
         FROM createinvoices WHERE id = ?`,
        id
    );
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
    details: string,
    completed: number
): Promise<boolean> =>{
    const invoiceinfo = db.runSync(
        `UPDATE createinvoices SET invoicenumber = ?, invoicedate = ?, clientname = ?, products = ?, totalamount = ?, percentage = ?, tax = ?, notes = ?, termsandconditions = ?, details = ?, completed = ? WHERE id = ?`,
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
        completed,
        id
    );
    return invoiceinfo.changes > 0;
};

export const searchInvoice = async (query: string): Promise<InvoiceContent[]> => {
    const searchTerm = `%${query}%`;
    return db.getAllSync<InvoiceContent>(
        `SELECT id, invoicenumber, invoicedate, clientname, products, totalamount, percentage, tax, notes, termsandconditions, details, completed
         FROM createinvoices WHERE clientname LIKE ? OR products LIKE ? ORDER BY invoicenumber DESC`,
        searchTerm,
        searchTerm
    )
};

export const deleteInvoice = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM createinvoices WHERE id = ?`, id);
    return result.changes > 0;
};

export const toggleInvoiceCompleted = async (id: number, completed: number): Promise<boolean> => {
    const result = db.runSync(`UPDATE createinvoices SET completed = ? WHERE id = ?`, completed, id);
    return result.changes > 0;
};
