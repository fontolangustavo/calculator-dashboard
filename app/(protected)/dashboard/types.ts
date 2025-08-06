export type Operation = {
    id: string;
    type: string;
    operands: number[];
    result: string;
    cost: number;
    date: string;
};

export type OperationType = {
    type: string;
    cost: number;
};
