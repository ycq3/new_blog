import React, { ReactNode } from "react";
import { Row, Col } from 'antd';
import style from './detail.less'
import ArticalMenu from './_artical_menu'

export default class ArticalDetail extends React.Component<any>{
    public static layout = {
        hideMenu: true,
        hideNav: true,
        hideFooter: false,
    }
    render(): ReactNode {
        console.log(this.props.match.params.id);

        return <>
            <div className={style.menu}>
                <ArticalMenu></ArticalMenu>
            </div>
            <Row>
                <Col offset={4} span={20}>
                    <div className={style.center}>
                        <div className={style.title}>Flink消费Kafka统计点击量</div>
                        <div>content</div>
                        <div>footer</div>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <h1 id="Anchor-Props">Anchor-Props</h1>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <h1 id="Link-Props">Link-Props</h1>
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <br /><br /><br /><br /><br /><br /><br /><br /><br />
                        <div>comment</div>
                    </div>
                </Col>
            </Row>
        </>
    }
}