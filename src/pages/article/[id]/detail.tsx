import React, { ReactNode } from 'react';
import { Row, Col } from 'antd';
import style from './detail.less';
import { request } from 'umi';
import MarkdownPreview from '@uiw/react-markdown-preview';
import MarkdownNavbar from 'markdown-navbar';
// import { MarkdownNavbar as MarkdownNavbarClass } from 'markdown-navbar';
import ArticleMenu from './_compoment/artical_menu';

class Test extends MarkdownNavbar<any> {
  //TS2507: Type '(options: MarkdownNavbarProps) => Element' is not a constructor function type.
  updateHash() {
    console.log('debug');
    debugger;
  }
}

export default class ArticleDetail extends React.Component<any> {
  public static layout = {
    hideMenu: true,
    hideNav: true,
    hideFooter: false,
  };

  state = {
    data: null,
  };

  componentDidMount() {
    this.loadDetail();
  }

  loadDetail() {
    const { id } = this.props.match.params;
    request(`/api/article/${id}/detail`).then((resp) => {
      this.setState({ data: resp.data });
    });
  }

  render(): ReactNode {
    if (this.state.data == null) {
      return <></>;
    }

    // const syntaxTheme = oneDark;

    // const MarkdownComponents: object = {
    // code({ node, inline, className, ...props }) {}
    // }

    //   },

    // const renderers = {
    //   code: CodeBlock,
    //   heading: HeadingBlock
    // }

    const {
      data: { title, html, content },
    } = this.state;

    return (
      <>
        <div className={style.menu}>
          {/*<ArticleMenu></ArticleMenu>*/}
          <Test
            source={content}
            updateHashAuto={false}
            ordered={false}
            declarative={true}
          />
        </div>
        <Row>
          <Col offset={4} span={20}>
            <div className={style.center}>
              <div className={style.title}>{title}</div>
              {/*<div dangerouslySetInnerHTML={{__html: html}}></div>*/}
              {/*<ReactMarkdown*/}
              {/*  // rehypePlugins={[rehypeHighlight]}*/}
              {/*  rehypePlugins={[*/}
              {/*    rehypeHighlight,*/}
              {/*    rehypeRaw,*/}
              {/*  ]}*/}
              {/*  remarkPlugins={[remarkGfm]}*/}
              {/*  // renderers={renderers}*/}
              {/*>*/}
              {/*  {content}*/}
              {/*</ReactMarkdown>*/}
              {/*{content}*/}
              <MarkdownPreview source={content} />
              {/*<div dangerouslySetInnerHTML={{__html: content}}></div>*/}
            </div>
          </Col>
        </Row>
      </>
    );
  }
}
