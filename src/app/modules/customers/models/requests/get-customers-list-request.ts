export type GetCustomersListRequest = {
    limit: number;
    sort: {
        field: string,
        reverse: boolean
    };
    page: number;
    list_name: string;
    launch_region_id: string;
}
