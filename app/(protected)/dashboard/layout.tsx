"use client";
import { Layout, Button, Avatar, Tooltip } from "antd";
import { DashboardSider } from "@/components/DashboardSider";
import { useAuth } from "@/components/AuthProvider";
import { WalletOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout, user } = useAuth();

    return (
        <Layout style={{ minHeight: "100dvh" }}>
            <DashboardSider />
            <Layout>
                <Header style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: "white" }}>
                        <Tooltip title="Your available balance">
                            <WalletOutlined style={{ fontSize: 20 }} />
                        </Tooltip>

                        <div>{user?.balance}</div>
                    </div>
                    <Avatar style={{ backgroundColor: "#faad14", verticalAlign: 'middle' }} size="large">
                        {user?.username}
                    </Avatar>
                    <Button onClick={logout}>Logout</Button>
                </Header>
                <Content style={{ margin: 16 }}>
                    <div style={{ background: "#fff", padding: 16, minHeight: 360 }}>{children}</div>
                </Content>
            </Layout>
        </Layout>
    );
}
