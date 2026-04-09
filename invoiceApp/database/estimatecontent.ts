import { db } from '@/database/db';
import { createInvoice } from '@/database/invoicecontent';
import { createInvoiceItem } from '@/database/invoiceitemsdb';
import { getEstimateItemsByEstimateId } from '@/database/estimateitemsdb';

export type EstimateContent = {
    id: number;
    estimatenumber: number;
    estimatedate: number;
    clientname: string;
    estimateproducts: string;
    estimatetotalamount: number;
    estimatepercentage: number;
    estimatetax: number;
    estimatenotes: string;
    estimatetermsandconditions: string;
    estimatedetails: string;
    estimatecompleted: number;
};

export const createEstimate = async (
    estimatenumber: number,
    estimatedate: number,
    clientname: string,
    estimateproducts: string,
    estimatetotalamount: number,
    estimatepercentage: number,
    estimatetax: number,
    estimatenotes: string,
    estimatetermsandconditions: string,
    estimatedetails: string,
    estimatecompleted: number = 0
): Promise<number> => {
    const result = db.runSync(
        `INSERT INTO createestimates (estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estimatenotes, estimatetermsandconditions, estimatedetails, estimatecompleted)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        estimatenumber,
        estimatedate,
        clientname,
        estimateproducts,
        estimatetotalamount,
        estimatepercentage,
        estimatetax,
        estimatenotes,
        estimatetermsandconditions,
        estimatedetails,
        estimatecompleted
    );
    return result.lastInsertRowId;
};

export const getEstimates = async (): Promise<EstimateContent[]> => {
    return db.getAllSync<EstimateContent>(
        `SELECT id, estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estimatenotes, estimatetermsandconditions, estimatedetails, estimatecompleted
         FROM createestimates ORDER BY id DESC`
    );
};

export const getEstimateById = async (id: number): Promise<EstimateContent | null> => {
    return db.getFirstSync<EstimateContent>(
        `SELECT id, estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estimatenotes, estimatetermsandconditions, estimatedetails, estimatecompleted
         FROM createestimates WHERE id = ?`,
        id
    );
};

export const updateEstimate = async (
    id: number,
    estimatenumber: number,
    estimatedate: number,
    clientname: string,
    estimateproducts: string,
    estimatetotalamount: number,
    estimatepercentage: number,
    estimatetax: number,
    estimatenotes: string,
    estimatetermsandconditions: string,
    estimatedetails: string,
    estimatecompleted: number
): Promise<boolean> => {
    const result = db.runSync(
        `UPDATE createestimates SET estimatenumber = ?, estimatedate = ?, clientname = ?, estimateproducts = ?, estimatetotalamount = ?, estimatepercentage = ?, estimatetax = ?, estimatenotes = ?, estimatetermsandconditions = ?, estimatedetails = ?, estimatecompleted = ? WHERE id = ?`,
        estimatenumber,
        estimatedate,
        clientname,
        estimateproducts,
        estimatetotalamount,
        estimatepercentage,
        estimatetax,
        estimatenotes,
        estimatetermsandconditions,
        estimatedetails,
        estimatecompleted,
        id
    );
    return result.changes > 0;
};

export const searchEstimates = async (query: string): Promise<EstimateContent[]> => {
    const searchTerm = `%${query}%`;
    return db.getAllSync<EstimateContent>(
        `SELECT id, estimatenumber, estimatedate, clientname, estimateproducts, estimatetotalamount, estimatepercentage, estimatetax, estimatenotes, estimatetermsandconditions, estimatedetails, estimatecompleted
         FROM createestimates WHERE clientname LIKE ? OR estimateproducts LIKE ? ORDER BY id DESC`,
        searchTerm,
        searchTerm
    );
};

export const deleteEstimates = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM createestimates WHERE id = ?`, id);
    return result.changes > 0;
};

export const toggleEstimateCompleted = async (id: number, completed: number): Promise<boolean> => {
    const result = db.runSync(
        `UPDATE createestimates SET estimatecompleted = ? WHERE id = ?`,
        completed,
        id
    );
    return result.changes > 0;
};

export const convertEstimateToInvoice = async (estimateId: number): Promise<number | null> => {
    const estimate = await getEstimateById(estimateId);
    if (!estimate) return null;

    const invoiceId = await createInvoice(
        estimate.estimatenumber,
        estimate.estimatedate,
        estimate.clientname,
        estimate.estimateproducts,
        estimate.estimatetotalamount,
        estimate.estimatepercentage,
        estimate.estimatetax,
        estimate.estimatenotes,
        estimate.estimatetermsandconditions,
        estimate.estimatedetails,
        0
    );

    const items = await getEstimateItemsByEstimateId(estimateId);
    if (items.length > 0) {
        await Promise.all(
            items.map((item) =>
                createInvoiceItem(
                    invoiceId,
                    item.productId ?? null,
                    item.estimatename,
                    Number(item.estimatequantity) || 0,
                    Number(item.estimateunitPrice) || 0,
                    item.estimatemanualAmount ?? null,
                    item.estimateuseManual ?? 0
                )
            )
        );
    }

    return invoiceId;
};
