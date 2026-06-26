import pool from "../configs/db-config.js";

export class ProvinceRepository {

    async getAll() {
        const result = await pool.query(
            "SELECT full_name FROM provinces ORDER BY id ASC"
        );
        return result.rows;
    }

    async getById(id) {
        const result = await pool.query(
            "SELECT * FROM provinces WHERE id = $1",
            [id]
        );
        return result.rows[0] || null;
    }

    async create(province) {
        const { name, full_name, latitude, longitude, display_order } = province;

        const result = await pool.query(
            `INSERT INTO provinces (name, full_name, latitude, longitude, display_order)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, full_name, latitude, longitude, display_order]
        );
        return result.rows[0];
    }

    async update(province) {
        const { id, name, full_name, latitude, longitude, display_order } = province;

        const result = await pool.query(
            `UPDATE provinces
             SET name = $1, full_name = $2, latitude = $3, longitude = $4, display_order = $5
             WHERE id = $6
             RETURNING *`,
            [name, full_name, latitude, longitude, display_order, id]
        );
        return result.rows[0] || null;
    }

    async deleteById(id) {
        const result = await pool.query(
            "DELETE FROM provinces WHERE id = $1 RETURNING *",
            [id]
        );
        return result.rows[0] || null;
    }
}
