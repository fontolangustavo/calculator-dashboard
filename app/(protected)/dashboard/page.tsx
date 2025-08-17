"use client";
import { useEffect, useState } from "react";
import { Table, message, Button, Space, Popconfirm, Tooltip } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { OperationModal } from "./OperationModal";

import { formatRelativeTime, formatFullDate } from "@/helpers/datetime";

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

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/records/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            if (!res.ok) {
                let details: any = {};
                try { details = await res.json(); } catch { }
                const msg = details?.message || `Failed with status ${res.status}`;
                throw new Error(msg);
            }

            messageApi.success("Record deleted successfully.");

            fetchData((pagination.current ?? 1) - 1, pagination.pageSize ?? 10);
        } catch (err: any) {
            messageApi.error(`Could not delete record: ${err?.message || err}`);
        } finally {
            setLoading(false);
        }
    };

    const columns: ColumnsType<Record> = [
        { title: "Type", dataIndex: "operationType", sorter: true },
        { title: "Amount", dataIndex: "amount", sorter: true },
        { title: "Response", dataIndex: "operationResponse", sorter: true },
        { title: "Balance", dataIndex: "userBalance", sorter: true },
        {
            title: "Date",
            dataIndex: "createdAt",
            sorter: true,
            render: (value: string) => (
                <Tooltip title={formatFullDate(value)}>
                    <span>{formatRelativeTime(value)}</span>
                </Tooltip>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Popconfirm
                        title="Delete this record?"
                        description="This action can't be undone."
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Tooltip title="Delete">
                            <Button danger size="small">Delete</Button>
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, marginBottom: 30 }}>
                <h2>Records</h2>
                <Button type="primary" onClick={() => setModalOpen(true)}>
                    Request Operation
                </Button>
            </div>
            <Table
                rowKey="id"
                loading={loading}
                columns={columns}
                dataSource={data}
                pagination={pagination}
                onChange={handleTableChange}
            />
            <OperationModal
                messageApi={messageApi}
                contextHolder={contextHolder}
                open={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    fetchData();
                }}
            />
        </div>
    );
}
