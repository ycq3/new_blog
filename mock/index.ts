import { Request, Response } from 'express';


export default {
  // 支持值为 Object 和 Array
  'GET /api/artical/list': (req: Request, res: Response) => {
    const { query:{page, page_size }} = req;
    let data = Array.from({ length: page_size??15 }).map((_, i) => ({
      id: i + (page - 1) * (page_size??15),
      href: 'https://ant.design',
      title: `ant design part ${i + (page - 1) * (page_size??15)}`,
      avatar: 'https://joeschmoe.io/api/v1/random',
      cover: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    }));
    return res.json({
      total:100,
      data:data
    })
  },

  // GET 可忽略
  '/api/users/1': { id: 1 },

  // 支持自定义函数，API 参考 express@4
  'POST /api/users/create': (req, res) => {
    // 添加跨域请求头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end('ok');
  },
};
