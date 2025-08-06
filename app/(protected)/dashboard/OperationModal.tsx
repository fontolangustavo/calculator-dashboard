"use client";
import { Modal, Form, InputNumber, Select, message } from "antd";
import { useEffect, useState } from "react";
import { OperationType } from "./types";

type Props = {
    open: boolean;
    onClose: () => void;
};

export function OperationModal({ open, onClose }: Props) {
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
                ? []
                : [values.operand1, values.operand2].filter(v => v !== undefined && v !== null);

            if (!isRandom && operands.length === 0) {
                message.error("Please provide at least one operand.");
                return;
            }

            const body = {
                type: values.type,
                operands,
            };

            await fetch(`/api/operations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            message.success("Operation requested successfully");
            onClose();
        } catch (e: any) {
            message.error(e.message || "Failed to request operation");
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
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Form.Item label="Operation Type" name="type" rules={[{ required: true }]}>
                    <Select
                        options={operationTypes.map(op => ({
                            label: `${op.type} - Cost: ${op.cost}`,
                            value: op.type,
                        }))}
                    />
                </Form.Item>
                {selectedType !== "RANDOM_STRING" && (
                    <>
                        <Form.Item label="Operand 1" name="operand1" rules={[{ required: true }]}>
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                        <Form.Item label="Operand 2" name="operand2">
                            <InputNumber style={{ width: "100%" }} />
                        </Form.Item>
                    </>
                )}
            </Form>
        </Modal>
    );
}
