import {db} from '@/database/db';

export type Employees = {
    id: number;
    ename: string;
    eemail: string;
    ephone: number;
    eage: number;
    eposition: string;
    erole: string;
    edetails: string;
    epay: number;
    eperformance: number;
    elanguage: string;
    eyears: number;
    ephoto?: string;
};

export const createEmployees = async (
    ename: string,
    eemail: string,
    ephone: number,
    eage: number,
    eposition: string,
    erole: string,
    edetails: string,
    epay: number,
    eperformance: number,
    elanguage: string,
    eyears: number,
    ephoto?: string
): Promise<number> =>{
    const result = db.runSync(
        `INSERT INTO employees (ename, eemail, ephone, eage, eposition, erole, edetails, epay, eperformance, elanguage, eyears, ephoto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        ename,
        eemail,
        ephone,
        eage,
        eposition,
        erole,
        edetails,
        epay,
        eperformance,
        elanguage,
        eyears,
        ephoto ?? null
    );

    return result.lastInsertRowId;
};

export const getEmployees = async (): Promise<Employees[]> => {
    return db.getAllSync<Employees>(
        `SELECT id, ename, eemail, ephone, eage, eposition, erole, edetails, epay, eperformance, elanguage, eyears, ephoto FROM employees ORDER BY ID DESC`
    );
};

export const getEmployeesById = async (id: number): Promise<Employees | null> => {
    return db.getFirstSync<Employees>(
        `SELECT id, name, eemail, ephone, eage, eposition, erole, edetails, epay, eperformance, elanguage, eyears, ephoto FROM emplotees WHERE id = ?`,
        id
    );
};

export const updateEmployees = async (
    id: number,
    ename: string,
    eemail: string,
    ephone: number,
    eage: number,
    eposition: string,
    erole: string,
    edetails: string,
    epay: number,
    eperformance: number,
    elanguage: string,
    eyears: number,
    ephoto?: string
): Promise<boolean> => {
    const result = db.runSync(
        `UPDATE employees SET ename = ?, eemail = ?, ephone = ?, eage = ?, eposition = ?, erole = ?, edetails = ?, epay = ?, eperfromance = ?, elanguage = ?, eyears = ?, ephots = ? WHERE id = ?`,
        ename,
        eemail,
        ephone,
        eage,
        eposition,
        erole,
        edetails,
        epay,
        eperformance,
        elanguage,
        eyears,
        ephoto ?? null,
        id
    );

    return result.changes > 0;

};

export const deleteEmployees = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM eployees WHERE id = ?`, id);
    return result.changes > 0;
}