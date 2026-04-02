import { db } from '@/database/db';

export type EstimateItem = {
    id: number;
    estimateId: number;
    productId?: number | null;
    estimatename: string;
    estimatequantity: number;
    estimateunitprice: number;
    estimatemanualamount?: number | null;
    estimateusemanual: number;
};

export const getEstimateItemsByEstimateId = async (estimateId: number): Promise<EstimateItem[]> => {
    return db.getAllSync<EstimateItem>(
        `SELECT id, estimateId, productId, estimatename, estimatequantity, estimateunitPrice, estimatemanualAmount, estimateuseManual
         FROM estimate_items WHERE estimateId = ? ORDER BY id ASC`,
         estimateId
    );
};

export const deleteEstimateItemsByEstimateId = async (estimateId: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM estimate_items WHERE estimateId = ?`, estimateId);
    return result.changes > 0;
};

export const createEstimateItem = async (
    estimateId: number,
    productId: number | null,
    estimatename: string,
    estimatequantity: number,
    estimateunitPrice: number,
    estimatemanualAmount: number | null,
    estimateuseManual: number
): Promise<number> => {
    const result = db.runSync(
        `INSERT INTO estimate_items (estimateId, productId, estimatename, estimatequantity, estimateunitPrice, estimatemanualAmount, estimateuseManual)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            estimateId,
            productId,
            estimatename,
            estimatequantity,
            estimateunitPrice,
            estimatemanualAmount,
            estimateuseManual
    );
    return result.lastInsertRowId;
};