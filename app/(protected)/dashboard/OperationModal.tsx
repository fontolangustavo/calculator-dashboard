"use client";
import { Modal, Form, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { OperationType } from "./types";
import { useAuth } from "@/components/AuthProvider";

type Props = {
    messageApi: any;
    contextHolder: any;
    open: boolean;
    onClose: () => void;
};

const safeParseJson = (text: string) => {
    if (!text) return undefined;
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
};

export function OperationModal({
    messageApi,
    contextHolder,
    open,
    onClose
}: Props) {
    const { refreshUser } = useAuth();
    const [form] = Form.useForm();
    const [operationTypes, setOperationTypes] = useState<OperationType[]>([]);
    const selectedType = Form.useWatch("type", form);

    useEffect(() => {
        if (!open) return;

        const fetchOperationTypes = async () => {
            try {
                const res = await fetch(`/api/operations/types`, {
                    method: "GET",
                    credentials: "include",
                });

                const json = await res.json();
                setOperationTypes(json.content);
            } catch (error) {
                console.error("Failed to fetch operation types:", error);
            }
        };

        fetchOperationTypes();
    }, [open]);

    const onFinish = async (values: any) => {
        try {
            const isRandom = values.type === "RANDOM_STRING";

            const operands = isRandom
                ? [values.operand1]
                : [values.operand1, values.operand2].filter(v => v !== undefined && v !== null);

            if (operands.length === 0) {
                messageApi.error("Please provide at least one operand.");
                return;
            }

            const body = {
                type: values.type,
                operands,
            };

            const res = await fetch(`/api/operations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const text = await res.text();
            const data = safeParseJson(text);

            if (res.ok) {
                messageApi.success("Operation requested successfully");
                refreshUser();
                onClose();

            } else {
                messageApi.open({
                    type: "error",
                    content: data.message,
                });
            }

        } catch (e: any) {
            messageApi.error(e.message || "Failed to request operation");
            onClose();
        }
    };

    return (
        <Modal
            open={open}
            title="Request Operation"
            onCancel={onClose}
            onOk={() => form.submit()}
            okText="Request"
        >
            {contextHolder}
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Operation Type" name="type" rules={[{ required: true }]}>
                    <Select
                        options={operationTypes.map(op => ({
                            label: `${op.type} - Cost: ${op.cost}`,
                            value: op.type,
                        }))}
                    />
                </Form.Item>
                <Form.Item label="Operand 1" name="operand1" rules={[{ required: true }]}>
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                {selectedType !== "RANDOM_STRING" && (
                    <Form.Item label="Operand 2" name="operand2">
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
