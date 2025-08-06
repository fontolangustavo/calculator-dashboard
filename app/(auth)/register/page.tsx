"use client";
import { Button, Card, Form, Input, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function RegisterPage() {
    const [messageApi, contextHolder] = message.useMessage();

    const onFinish = async (values: any) => {
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (!res.ok) throw new Error("Failed to register");
            messageApi.success("Account created! You are now logged in.");
            window.location.href = "/dashboard";
        } catch (e: any) {
            messageApi.error(e.message || "Failed to register");
        }
    };

    return (
        <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 16 }}>
            {contextHolder}
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center"}}>
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => (window.location.href = "/login")}
                        />
                        Create Account
                    </div>
                }
                style={{ width: 360 }}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true, min: 6 }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Create Account</Button>
                </Form>
            </Card>
        </div>
    );
}
