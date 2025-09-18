class QueryBuilder {
    static buildFilterQuery(baseQuery, filters, params = []) {
        if (!filters) return { query: baseQuery, params };

        Object.entries(filters).forEach(([column, value]) => {
            if (value !== undefined && value !== null) {
                if (typeof value === "object") {
                    // Handle comparison operators
                    if (value.$gte) {
                        baseQuery += ` AND ${column} >= ?`;
                        params.push(value.$gte);
                    }
                    if (value.$lte) {
                        baseQuery += ` AND ${column} <= ?`;
                        params.push(value.$lte);
                    }
                    if (value.$gt) {
                        baseQuery += ` AND ${column} > ?`;
                        params.push(value.$gt);
                    }
                    if (value.$lt) {
                        baseQuery += ` AND ${column} < ?`;
                        params.push(value.$lt);
                    }
                    if (value.$like) {
                        baseQuery += ` AND ${column} LIKE ?`;
                        params.push(value.$like);
                    }
                    // Handle array values for IN clause
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            const placeholders = value.map(() => "?").join(",");
                            baseQuery += ` AND ${column} IN (${placeholders})`;
                            params.push(...value);
                        }
                    }
                } else {
                    // Handle simple equality
                    baseQuery += ` AND ${column} = ?`;
                    params.push(value);
                }
            }
        });
        // console.log("🚀 ~ QueryBuilder ~ Object.entries ~ baseQuery:", params);

        return { query: baseQuery, params };
    }

    static buildSortQuery(query, sortBy, sortDirection) {
        if (sortBy) {
            const direction =
                sortDirection?.toUpperCase() === "ASC" ? "ASC" : "DESC";
            query += ` ORDER BY ${sortBy} ${direction}`;
        }
        return query;
    }

    static buildDateFilter(
        filters,
        startDate,
        endDate,
        dateField = "created_at"
    ) {
        if (startDate || endDate) {
            filters[dateField] = {
                ...(startDate && { $gte: startDate }),
                ...(endDate && { $lte: endDate }),
            };
        }
        return filters;
    }

    static buildOptions(req) {
        const {
            start_date,
            end_date,
            sort_by,
            sort_direction,
            status,
            ...otherFilters
        } = req.query;

        const filters = {
            ...otherFilters,
            ...(status && { operation_status: status }),
        };

        // Add date filtering if provided
        if (start_date || end_date) {
            filters.created_at = {
                ...(start_date && { $gte: start_date }),
                ...(end_date && { $lte: end_date }),
            };
        }

        return {
            filters,
            sortBy: sort_by,
            sortDirection: sort_by ? sort_direction || "DESC" : undefined,
        };
    }
}

module.exports = QueryBuilder;
