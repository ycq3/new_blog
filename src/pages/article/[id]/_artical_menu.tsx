import { Tree } from 'antd';
import React from 'react';
import { Anchor } from 'antd';
const { Link } = Anchor;

export default class ArticalMenu extends React.Component<any>{
    render(): React.ReactNode {
        return <>
            <Anchor>
                <Link href="#components-anchor-demo-basic" title="Basic demo" />
                <Link href="#components-anchor-demo-static" title="Static demo" />
                <Link href="#API" title="API">
                    <Link href="#Anchor-Props" title="Anchor Props" />
                    <Link href="#Link-Props" title="Link Props" />
                </Link>
            </Anchor>
        </>
    }
}
