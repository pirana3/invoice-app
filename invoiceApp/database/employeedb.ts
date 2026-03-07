import {db} from '@/database/db';

export type Employee = {
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

export const createEmployee = async (
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

export const getEmployees = async (): Promise<Employee[]> => {
    return db.getAllSync<Employee>(
        `SELECT id, ename, eemail, ephone, eage, eposition, erole, edetails, epay, eperformance, elanguage, eyears, ephoto FROM employees ORDER BY ID DESC`
    );
};

export const getEmployeeById = async (id: number): Promise<Employee | null> => {
    return db.getFirstSync<Employee>(
        `SELECT id, name, eemail, ephone, eage, eposition, erole, edetails, epay, eperformance, elanguage, eyears, ephoto FROM emplotees WHERE id = ?`,
        id
    );
};

export const updateEmployee = async (
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

export const delteEmployee = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM eployees WHERE id = ?`, id);
    return result.changes > 0;
}