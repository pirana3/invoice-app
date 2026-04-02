import {db} from '@/database/db';

export type EstimateContent = {
    if: number;
    estimatenumber: number;
    estimatedate: number;
    clientname: string;
    estiamteproducts: string;
    estiamtetotalamount: number;
    estiamntepercentage: number;
    estiamtetax: number;
    estiamtenotes: string;
    estiamtetermsandconditions: string;
    estiamtedetails: string;
    estimatecompleted: number;

};

export const createEstimate = async (
    estimatenumber: number,
    estimatedate: number,
    clientname: string,
    estiamteproducts: string,
    estiamtetotalamount: number,
    estiamntepercentage: number,
    estiamtetax: number,
    estiamtenotes: string,
    estiamtetermsandconditions: string,
    estiamtedetails: string,
    estimatecompleted: number = 0
): Promise<number> => {
    const result = db.runSync(
        `INSERT INTO createestimates (estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estiamtenotes, estiamtetermsandconditions, estiamtedetails, estimatecompleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        estimatenumber,
        estimatedate,
        clientname,
        estiamteproducts,
        estiamtetotalamount,
        estiamntepercentage,
        estiamtetax,
        estiamtenotes,
        estiamtetermsandconditions,
        estiamtedetails,
        estimatecompleted
    );
    return result.lastInsertRowId;
};

export const getEstimates = async (): Promise<EstimateContent[]> => {
    return db.getAllAsync<EstimateContent>(
        `SELECT id, estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estiamtenotes, estiamtetermsandconditions, estiamtedetails, estimatecompleted
         FROM createestimates ORDER BY id DESC`,
    );
}

export const getEstimateById = async (id: number): Promise<EstimateContent | null> =>{
    return db.getFirstAsync<EstimateContent>(
        `SELECT id, estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estiamtenotes, estiamtetermsandconditions, estiamtedetails, estimatecompleted
         FROM createestimates WHERE id = ?`,
         id
    )
}

export const updateEstiamte = async(
    id: number,
    estimatenumber: number,
    estimatedate: number,
    clientname: string,
    estiamteproducts: string,
    estiamtetotalamount: number,
    estiamntepercentage: number,
    estiamtetax: number,
    estiamtenotes: string,
    estiamtetermsandconditions: string,
    estiamtedetails: string,
    estimatecompleted: number
): Promise<boolean> =>{
    const estiamateinfo = db.runSync(
        `UPDATE createestimates SET estimatenumber = ?, estimatedate = ?, clientname = ?, estimateproducts = ?, estimatetotalamount = ?, estimatepercentage = ?, estimatetax = ?, estiamtenotes = ?, estiamtetermsandconditions = ?, estiamtedetails = ?, estimatecompleted = ? WHERE id = ?`,
        estimatenumber,
        estimatedate,
        clientname,
        estiamteproducts,
        estiamtetotalamount,
        estiamntepercentage,
        estiamtetax,
        estiamtenotes,
        estiamtetermsandconditions,
        estiamtedetails,
        estimatecompleted,
        id
    );
    return estiamateinfo.changes > 0;
};

export const searchEstimates = async (query: string): Promise<EstimateContent[]> => {
    const searchTerm = `%${query}%`;
    return db.getAllSync<EstimateContent>(
        `SELECT id, estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estiamtenotes, estiamtetermsandconditions, estiamtedetails, estimatecompleted
         FROM createestimates WHERE clientname LIKE ? OR estimateproducts LIKE ? ORDER BY id DESC`,
            searchTerm,
            searchTerm 
    )
};

export const deleteEstimates = async (id: number): Promise<boolean> =>{
    const result = db.runSync(`DELETE FROM createestimates WHERE id = ?`, id);
    return result.changes > 0;
};

export const toggleEstimateCompleted = async (id: number, completed: boolean): Promise<boolean> => {
    const result = db.runSync(`UPDATE createestimates SET estimatecompleted = ? WHERE id = ?`, completed ? 1 : 0, id);
    return result.changes > 0;
}