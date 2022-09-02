import { Card, Pagination, Row, Col, Space, Image } from 'antd';
import React from "react";
import { Link } from 'umi'
import { history } from 'umi';

import { LikeOutlined, MessageOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons';

const IconText = ({ icon, text }: { icon: React.FC; text: string }) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);

interface IArtical {
    id: number
    description: string
    title: string
    cover?: string
}

export default class ArticalCard extends React.Component<IArtical> {
    render(): React.ReactNode {
        const { title, description, cover, id } = this.props
        const articalUrl = `/article/${id}/detail`
        // debugger
        return <>
            <Card title={title} extra={<Link to={articalUrl}>More</Link>}
                hoverable={true}
                // cover={<img src={cover}></img>}
                actions={[
                    <IconText icon={CalendarOutlined} text="2022-12-30" key="list-vertical-star-o" />,
                    <IconText icon={EyeOutlined} text="156" key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                ]}
                onClick={() => history.push({
                    pathname: articalUrl
                })}
            >
                <Row gutter={[16, 24]}>
                    <Col span={6}>
                        <img style={{width:'100%', height:'auto'}} src={cover}></img>
                    </Col>
                    <Col span={18}> <p>  {description}</p></Col>
                </Row>
               
            </Card>
        </>
    }

}
