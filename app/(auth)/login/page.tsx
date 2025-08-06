"use client";
import { Button, Card, Form, Input, Typography, message } from "antd";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
    const [messageApi, contextHolder] = message.useMessage();
    const params = useSearchParams();
    const next = params.get("next") || "/dashboard";

    const onFinish = async (values: any) => {
        try {
            const res = await fetch("api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) throw new Error("Invalid credentials");

            messageApi.success("Welcome!");

            window.location.href = next;
        } catch (e: any) {
            messageApi.error(e.message || "Login failed");
        }
    };

    return (
        <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", padding: 16 }}>
            {contextHolder}
            <Card title="Login" style={{ width: 360 }}>
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label="Username" name="username" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Password" name="password" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block>Login</Button>
                    <Typography.Paragraph style={{ marginTop: 12 }}>
                        Don't have an account? <a href="/register">Register</a>
                    </Typography.Paragraph>
                </Form>
            </Card>
        </div>
    );
}


export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginContent />
        </Suspense>
    );
}
