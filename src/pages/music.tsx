import {HomeOutlined} from '@ant-design/icons'
import { Input,Button,Table } from 'antd';

function MusicPage() {
  const dataSource = [
    {
      key: '1',
      play_list_id: 456,
      song_id: 32,
      artist:'123',
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      play_list_id: 123,
      song_id: 42,
      artist:'artist',
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: '歌单ID',
      dataIndex: 'play_list_id',
    },
    {
      title: '歌曲ID',
      dataIndex: 'song_id',
    },
    {
      title: '歌曲名',
      dataIndex: 'name',
    },
    {
      title:"歌手",
      dataIndex: 'artist',
    }
  ];

    return (
        <div>
            <h1>Page MusicPage</h1>
          <Input.Group compact>
            <Input style={{ width: 'calc(100% - 200px)' }} placeholder="输入歌单ID" />
            <Button type="primary">导入</Button>
          </Input.Group>
          <Table dataSource={dataSource} columns={columns} />
        </div>
    );
}

MusicPage.menu = {
    name: '音乐🎵', // 兼容此写法
    icon: <HomeOutlined />
}


export default MusicPage
