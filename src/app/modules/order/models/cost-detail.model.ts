export class CostDetail {
    name?: string;
    value?: number;
    style?: number;
    distance?: number;
    price?: number;
    quantity?: number;
    children?: CostDetail[] = [];
    baseUserCost?: number;
    userCost?: number;
}
