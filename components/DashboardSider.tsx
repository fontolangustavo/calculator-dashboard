"use client";
import { Layout, Menu } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const { Sider } = Layout;

const items = [
    { key: "/dashboard", label: "Records" },
];

export function DashboardSider() {
    const pathname = usePathname();

    return (
        <Sider breakpoint="lg" collapsedWidth="0">
            <div style={{ color: "#fff", padding: 16, fontWeight: 600 }}>
                My Dashboard
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
                items={items.map((i) => ({
                    key: i.key,
                    label: <Link href={i.key}>{i.label}</Link>,
                }))}
            />
        </Sider>
    );
}
