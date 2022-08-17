import React, { useState } from 'react';
import { Skeleton } from 'antd';
import { Dropdown, Space, Avatar, Layout, Menu, } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    HomeOutlined,
    PlusOutlined,
    DownOutlined,

} from '@ant-design/icons'; //importing icons from ant design 
const { Header, Sider, Content } = Layout;


const Loading = () => {


    const [collapsed, setCollapsed] = useState(false);
    const profileMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <button >Profile</button>
                    ),
                },
                {
                    key: '2',
                    label: (
                        <button onClick={() => {
                        }} >Logout</button>
                    ),
                },
            ]}
        />
    );


    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed} className='min-h-[100vh]'>
                <Menu
                    theme="dark"
                    mode="inline"
                    disabled
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <HomeOutlined />,
                            label: 'Home',
                        },
                        {
                            key: '2',
                            icon: <PlusOutlined />,
                            label: 'Post',
                        },
                        {
                            key: '3',
                            icon: <UserOutlined />,
                            label: 'Profile',
                        },
                    ]}
                />
            </Sider>
            <Layout className="site-layout mx-auto ">
                <Header
                    className="site-layout-background"
                    style={{
                        paddingLeft: '10px',
                    }}
                >

                    <div className="headerContaier flex flex-row justify-between items-center">

                        <div className="left">
                            {/* Icon to collapse the navigation menu */}
                            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: () => setCollapsed(!collapsed),
                            })}
                        </div>
                        <div className="middle">
                            <p className='font-extrabold text-2xl p-0 m-0 mobile:hidden laptop:inline-block desktop:inline-block tablet:inline-block'>Readme-c17</p>
                        </div>
                        <div className="right">
                            <Dropdown disabled overlay={profileMenu}>
                                {/* e.preventDefault() used to stop the page from reloading  */}
                                {/* Whenever user clicks an event object shoots, inside that event object contains preventDefault */}
                                <button onClick={
                                    (event) => event.preventDefault()
                                }>
                                    <Space>
                                        <Avatar icon={<UserOutlined />} />
                                        User Name
                                        <DownOutlined />
                                    </Space>
                                </button>
                            </Dropdown>
                        </div>
                    </div>
                </Header>


                <Content
                    className="content w-full container mt-10 mx-auto h-auto laptop:px-0 mobile:px-5 desktop:px-0 "
                >
                    <div className='container mx-auto'>
                        {
                            [1, 2, 3, 4].map((skel, index) => {
                                return (
                                    <>
                                        <Skeleton
                                            key={index}
                                            avatar
                                            active={true}
                                            paragraph={{
                                                rows: 4,
                                            }}
                                        />
                                    </>
                                )
                            })
                        }
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Loading;