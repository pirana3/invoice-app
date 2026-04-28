import {db} from '@/database/db';

export type Customers = {
    id: number;
    cname: string;
    cemail: string;
    cphone: number;
    caddress: string;
    ccity: string;
    czip: number;
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
    czip: number,
    cstate: string,
    ccompany: string,
    cdetails: string,
    cphoto: string
): Promise<number> => {
    const result = db.runSync(
        `INSERT INTO customers (cname, cemail, cphone, caddress, ccity, czip, cstate, ccompany, cdetails, cphoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        cname,
        cemail,
        cphone,
        caddress,
        ccity,
        czip,
        cstate,
        ccompany,
        cdetails,
        cphoto
    );
    
    return result.lastInsertRowId;
};

export const getCustomers = async (): Promise<Customers[]> => {
    return db.getAllSync(
        `SELECT id, cname, cemail, cphone, caddress, ccity, czip, cstate, ccompany, cdetails, cphoto
         FROM customers ORDER BY id DESC`
    ) as Customers[];
};

export const getCustomerById = async (id: number): Promise<Customers | null> => {
    return db.getFirstSync(
        `SELECT id, cname, cemail, cphone, caddress, ccity, czip, cstate, ccompany, cdetails, cphoto
         FROM customers WHERE id = ?`,
        id
    ) as Customers | null;
};

export const updateCustomer = async (
    id: number,
    cname: string,
    cemail: string,
    cphone: number,
    caddress: string,
    ccity: string,
    czip: number,
    cstate: string,
    ccompany: string,
    cdetails: string,
    cphoto: string
): Promise<boolean> => {
    const result = db.runSync(
        `UPDATE customers SET cname = ?, cemail = ?, cphone = ?, caddress = ?, ccity = ?, czip = ?, cstate = ?, ccompany = ?, cdetails = ?, cphoto = ? WHERE id = ?`,
        cname,
        cemail,
        cphone,
        caddress,
        ccity,
        czip,
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
    return db.getAllSync(
        `SELECT id, cname, cemail, cphone, caddress, ccity, czip, cstate, ccompany, cdetails, cphoto
         FROM customers WHERE cname LIKE ? OR cemail LIKE ? OR ccompany LIKE ? ORDER BY cname ASC`,
        searchTerm,
        searchTerm,
        searchTerm
    ) as Customers[];
};

export const deleteCustomer = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM customers WHERE id = ?`, id);
    return result.changes > 0;
};
