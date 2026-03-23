import {db} from '@/database/db';

export type Bdocuments = {
    id: number;
    title: string;
    buri: string;
    bdate: string;
};

export const getBdocuments = async (): Promise<Bdocuments[]> => {
    return db.getAllAsync<Bdocuments>(
        `SELECT id, title, buri, bdate FROM bdocuments ORDER BY id DESC`
    );
};

export const getBdocumentsById = async (id: number): Promise<Bdocuments | null> => {
    return db.getFirstSync<Bdocuments>(
        `SELECT id, title, buri, bdate FROM bdocuments WHERE id = ?`,
        id
    );
}

export const searchBdocuments = async (query: string): Promise<Bdocuments[]> => {
    const searchTerm = `%${query}%`;
    return db.getAllSync<Bdocuments>(
        `SELECT id, title, bdate FROM bdocuments WHERE title LIKE ? OR bdate LIKE ? ORDER BY title ASC`,
        searchTerm,
        searchTerm
    );
};

export const deleteBdocuments = async (id: number): Promise<boolean> => {
    const result = db.runSync(`DELETE FROM bdocuments WHERE id = ?`, id);
    return result.changes > 0;
}