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
}
