import { HomeOutlined } from '@ant-design/icons';
import { Button, Input, Table, Modal } from 'antd';
import React, { Component } from 'react';
import { request } from '@@/plugin-request/request';

interface MusicState {
  data: Array<any>;
  currentPage: number;
  pageSize: number;
  total: number;
  playListId: number;
  isModalOpen: boolean;
  loading: boolean;
}

export default class MusicPage extends Component<any, MusicState> {
  public static menu = {
    name: '音乐🎵', // 兼容此写法
    icon: <HomeOutlined />,
  };

  state = {
    data: [],
    currentPage: 1,
    pageSize: 15,
    total: 0,
    playListId: 0,
    isModalOpen: true,
    loading: true,
  };

  componentDidMount() {
    this.loadPlayList(this.state.playListId);
  }

  loadPlayList(playListId: number) {
    const { currentPage, pageSize } = this.state;
    request('/api/songs/play_list/' + playListId, {
      params: {
        page: currentPage,
        pageSize: pageSize,
      },
    }).then((resp) => {
      this.setState({ loading: true });
      const { data, total } = resp;
      this.setState({ data: data, total: total, loading: false });
    });
  }

  download() {}

  render(): React.ReactNode {
    const dataSource = this.state.data;

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
        title: '歌手',
        dataIndex: 'artist',
      },
    ];

    async function DownloadFiles(paramToFiles: any) {
      try {
        var dirHandle = await window.showDirectoryPicker({
          startIn: 'music', //default folder
          writable: true, //ask for write permission
        }); //move script from function startDownload to here, because of an error "SecurityError: Failed to execute 'showDirectoryPicker' on 'Window': Must be handling a user gesture to show a file picker.". It was working on localhost.
        for (var index in paramToFiles.Files) {
          var file = paramToFiles.Files[index];
          const fileHandle = await dirHandle.getFileHandle(file.FileName, {
            create: true,
          });
          if (await verifyPermission(fileHandle, true)) {
            const writable = await fileHandle.createWritable();
            await writable.write(await getBlob(file.URL));
            await writable.close();
          }
        }
      } catch (error) {
        alert(error);
      }
      return false;
    }

    // async function startDownload(dirHandle, paramToFiles) {
    //   //move above
    // }

    async function verifyPermission(fileHandle: any, readWrite: boolean) {
      const options = {
        mode: 'read',
      };
      if (readWrite) {
        options.mode = 'readwrite';
      }
      if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
      }

      return (await fileHandle.requestPermission(options)) === 'granted';
    }

    function getBlob(urlToGet: string) {
      return fetch(urlToGet).then((data) => data.blob());
    }

    const { isModalOpen, loading } = this.state;

    return (
      <div>
        <h3>由于版权原因，仅供学习交流使用</h3>
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 200px)' }}
            placeholder="输入歌单ID"
          />
          <Button type="primary">导入</Button>
        </Input.Group>
        <Button
          type="primary"
          onClick={() => this.setState({ isModalOpen: true })}
        >
          下载当前列表所有歌曲
        </Button>
        <Modal
          title="Basic Modal"
          open={isModalOpen}
          onCancel={() => this.setState({ isModalOpen: false })}
          confirmLoading={loading}
        >
          <p>当前一共有 {dataSource.length} 首歌曲，确定全部下载吗？</p>
          <p>下载不支持断点续传，所以请尽量不要操作浏览器</p>
        </Modal>
        <Table dataSource={dataSource} columns={columns} />
      </div>
    );
  }
}
