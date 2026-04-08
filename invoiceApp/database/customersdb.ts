import {db} from '@/database/db';

export type Customers = {
    id: number;
    cname: string;
    cemail: string;
    cphone: number;
    caddress: string;
    ccity: string;
    cstate: string;
    ccompany: string;
    cdetails: string;
    cphoto: string;
};

export const createCustomer = async (
    cname: string,
    cemail: string,
    cphone: number,
    caddress: string,
    ccity: string,
    cstate: string,
    ccompany: string,
    cdetails: string,
    cphoto: string
): Promise<number> => {
    const result = db.runSync(
        `INSERT INTO customers (cname, cemail, cphone, caddress, ccity, cstate, ccompany, cdetails, cphoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        cname,
        cemail,
        cphone,
        caddress,
        ccity,
        cstate,
        ccompany,
        cdetails,
        cphoto
    );
    
    return result.lastInsertRowId;
};

export const getCustomers = async (): Promise<Customers[]> => {
    return db.getAllSync<Customers>(
        `SELECT id, cname, cemail, cphone, caddress, ccity, cstate, ccompany, cdetails, cphoto
         FROM customers ORDER BY id DESC`
    );
};

export const getCustomerById = async (id: number): Promise<Customers | null> => {
    return db.getFirstSync<Customers>(
        `SELECT id, cname, cemail, cphone, caddress, ccity, cstate, ccompany, cdetails, cphoto
         FROM customers WHERE id = ?`,
        id
    );
};

export const updateCustomer = async (
    id: number,
    cname: string,
    cemail: string,
    cphone: number,
    caddress: string,
    ccity: string,
    cstate: string,
    ccompany: string,
    cdetails: string,
    cphoto: string
): Promise<boolean> => {
    const result = db.runSync(
        `UPDATE customers SET cname = ?, cemail = ?, cphone = ?, caddress = ?, ccity = ?, cstate = ?, ccompany = ?, cdetails = ?, cphoto = ? WHERE id = ?`,
        cname,
        cemail,
        cphone,
        caddress,
        ccity,
        cstate,
        ccompany,
        cdetails,
        cphoto,
        id
    );
    return result.changes > 0;
};

export const searchCustomers = async (query: string): Promise<Customers[]> => {
    const searchTerm = `%${query}%`;
    return db.getAllSync<Customers>(
        `SELECT id, cname, cemail, cphone, caddress, ccity, cstate, ccompany, cdetails, cphoto
         FROM customers WHERE cname LIKE ? OR cemail LIKE ? OR ccompany LIKE ? ORDER BY cname ASC`,
        searchTerm,
        searchTerm,
        searchTerm
    );
};

export const deleteCustomer = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM customers WHERE id = ?`, id);
    return result.changes > 0;
};
