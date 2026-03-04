import {db} from '@/database/db';

export type BusinessInfo = {
    id: number;
    bname: string;
    email: string;
    phone: number;
    address: string;
    industry: string;
    logo?: string;
}

export const createBusinessInfo = async (
    bname: string,
    email: string,
    phone: number,
    address: string,
    industry: string,
    logo?: string
): Promise<number> =>{
    const result = db.runSync(
        `INSERT INTO businessesinfo (bname, email, phone, address, industry, logo) VALUES (?, ?, ?, ?, ?, ?)`,
        bname,
        email,
        phone,
        address,
        industry,
        logo ?? null
    );

    return result.lastInsertRowId;
};

export const getBusinessInfo = async (): Promise<BusinessInfo[]> =>{
    return db.getAllSync<BusinessInfo>(
        `SELECT id, bname, email, phone, address, industry, logo FROM businessesinfo ORDER BY ID DESC`
    );
};

export const getBusinessInfoById = async (id: number): Promise<BusinessInfo | null> =>{
    return db.getFirstSync<BusinessInfo>(
        `SELECT id, bname, email, phone, address, industry, logo FROM businessesinfo WHERE id = ?`,
        id
    );
};

export const updateBusinessInfo = async (
    id: number,
    bname: string,
    email: string,
    phone: number,
    address: string,
    industry: string,
    logo?: string
): Promise<boolean> => {
    const result = db.runSync(
        `UPDATE businessesinfo SET bname = ?, email = ?, phone = ?, address =?, industry = ?, logo = ? WHERE id = ?`,
        bname,
        email,
        phone,
        address,
        industry,
        logo ?? null,
        id
    );

    return result.changes > 0;
};