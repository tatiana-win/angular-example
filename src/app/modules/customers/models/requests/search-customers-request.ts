export type SearchCustomersRequest = {
    current_page: number;
    limit: number;
    first_ride_region_id: string;
    sort: {
        field: string,
        reverse: boolean
    };
    email?: string;
    phone?: string;
    last_name?: string;
    first_name?: string;
    promo_code?: string;
}
