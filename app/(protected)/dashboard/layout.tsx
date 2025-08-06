"use client";
import { Layout, Button } from "antd";
import { DashboardSider } from "@/components/DashboardSider";
import { useAuth } from "@/components/AuthProvider";

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();

    return (
        <Layout style={{ minHeight: "100dvh" }}>
            <DashboardSider />
            <Layout>
                <Header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
                    <Button onClick={logout}>Logout</Button>
                </Header>
                <Content style={{ margin: 16 }}>
                    <div style={{ background: "#fff", padding: 16, minHeight: 360 }}>{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
}
