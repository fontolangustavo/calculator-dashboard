"use client";
import { useEffect, useState } from "react";
import { Table, Input, message, Button } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { OperationModal } from "./OperationModal";

type Record = {
    id: string;
    operationType: string;
    amount: string;
    userBalance: string;
    operationResponse: string;
    date: string;
};

type ApiResponse = {
    content: Record[];
    totalElements: number;
    number: number;
    size: number;
};

export default function RecordsPage() {
    const [messageApi, contextHolder] = message.useMessage();
    const [data, setData] = useState<Record[]>([]);
    const [pagination, setPagination] = useState<TablePaginationConfig>({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);

    const fetchData = async (
        page: number = 0,
        size: number = 10,
        sortBy: string = "date",
        sortDir: string = "DESC",
        searchText: string = ""
    ) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
                sortBy,
                sortDir,
            });
            if (searchText) params.append("search", searchText);

            const res = await fetch(`/api/records`, {
                method: "GET",
                credentials: "include",
            });

            const json = await res.json();
            setData(json.content);

            setPagination((prev) => ({
                ...prev,
                total: json.totalElements,
                current: json.number + 1,
                pageSize: json.size,
            }));
        } catch (err) {
            messageApi.error("Error loading records: " + err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTableChange = (pagination: TablePaginationConfig, _: any, sorter: any) => {
        const sortBy = sorter?.field || "operationType";
        const sortDir = sorter?.order === "ascend" ? "ASC" : "DESC";
        fetchData((pagination.current ?? 1) - 1, pagination.pageSize ?? 10, sortBy, sortDir, search);
    };

    const columns: ColumnsType<Record> = [
        { title: "Type", dataIndex: "operationType", sorter: true },
        { title: "Amount", dataIndex: "amount", sorter: true },
        { title: "Response", dataIndex: "operationResponse", sorter: true },
        { title: "Balance", dataIndex: "userBalance", sorter: true },
        { title: "Date", dataIndex: "createdAt", sorter: true },
    ];

    return (
        <div>
            {contextHolder}
            <h2 style={{ marginBottom: 10 }}>Records</h2>
            <Button type="primary" onClick={() => setModalOpen(true)}>
                Request Operation
            </Button>
            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={handleTableChange}
            />
            <OperationModal open={modalOpen} onClose={() => {
                setModalOpen(false);
                fetchData();
            }} />
        </div>
    );
}
