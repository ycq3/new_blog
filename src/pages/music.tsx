import { HomeOutlined } from '@ant-design/icons';
import { Button, Input, Table, Modal, Radio, Checkbox } from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { Component } from 'react';
import { request } from '@@/plugin-request/request';
import { FileSystemGetFileOptions } from 'wicg-file-system-access';

interface Song {
  id: number;
  artist: string;
  name: string;
  play_list_id: number;
  quality: number;
  song_id: number;
  qualityText: string;
  status: number;
}

interface MusicState {
  data: Array<Song>;
  currentPage: number;
  pageSize: number;
  total: number;
  playListId: number;
  isModalOpen: boolean;
  loading: boolean;
  qualitySelect: number;
  emptyCount: number;
}

export default class MusicPage extends Component<any, MusicState> {
  public static menu = {
    name: '音乐🎵', // 兼容此写法
    icon: <HomeOutlined />,
  };

  private dirHandle: FileSystemDirectoryHandle | undefined;

  state = {
    data: Array<Song>(),
    currentPage: 1,
    pageSize: 15,
    total: 0,
    playListId: 7549065045,
    isModalOpen: true,
    loading: true,
    qualitySelect: 1,
    emptyCount: 0,
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
      let emptyCount = 0;
      data.map((i: Song) => {
        const qualityText = ['FLAC', 'm4a', '320K', '128K', 'ERROR'];
        i.qualityText = qualityText[i.quality - 1] ?? 'ERROR';
        if (i.quality > 4) {
          emptyCount++;
        }
        return i;
      });

      this.setState({
        data: data,
        total: total,
        loading: false,
        emptyCount: emptyCount,
      });
    });
  }

  async download() {
    if (this.dirHandle == null) {
      this.dirHandle = await window.showDirectoryPicker({
        startIn: 'music', //default folder
        writable: true, //ask for write permission
      });
    }
    const { data } = this.state;
    // this.dirHandle

    for (const i of data) {
      if (i.quality < 5) {
        await this.getBlob(i);
      }
    }
  }

  async getBlob(s: Song) {
    const urlToGet = 'api/song/' + s.id + '/' + s.quality;
    const data = await fetch(urlToGet);
    if (data.status != 200) {
      s.status = -1;
      return;
    }

    const filename: string | null =
      data.headers.get('Content-Disposition')?.split('filename=')[1] ?? null;
    if (filename == null) {
      return;
    }

    // return data.blob();

    const fileHandle = await this.dirHandle?.getFileHandle(filename, {
      create: true,
    });

    if (fileHandle == null) {
      console.error('get file handle' + fileHandle);
      return;
    }

    if (await this.verifyPermission(fileHandle, true)) {
      const writable = await fileHandle.createWritable();
      await writable.write(await data.blob());
      await writable.close();
    }
  }

  async verifyPermission(fileHandle: any, readWrite: boolean) {
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
      {
        title: '音质',
        dataIndex: 'qualityText',
      },
    ];

    // async function DownloadFiles(paramToFiles: any) {
    //   try {
    //     var dirHandle = await window.showDirectoryPicker({
    //       startIn: 'music', //default folder
    //       writable: true, //ask for write permission
    //     }); //move script from function startDownload to here, because of an error "SecurityError: Failed to execute 'showDirectoryPicker' on 'Window': Must be handling a user gesture to show a file picker.". It was working on localhost.
    //     for (var index in paramToFiles.Files) {
    //       var file = paramToFiles.Files[index];
    //       const fileHandle = await dirHandle.getFileHandle(file.FileName, {
    //         create: true,
    //       });
    //       if (await verifyPermission(fileHandle, true)) {
    //         const writable = await fileHandle.createWritable();
    //         await writable.write(await getBlob(file.URL));
    //         await writable.close();
    //       }
    //     }
    //   } catch (error) {
    //     alert(error);
    //   }
    //   return false;
    // }

    // async function startDownload(dirHandle, paramToFiles) {
    //   //move above
    // }

    const { isModalOpen, loading, qualitySelect, emptyCount } = this.state;

    return (
      <div>
        <h3>由于版权原因，不对外开放</h3>
        <Input.Group compact>
          <Input placeholder="输入歌单ID" style={{ width: '300px' }} />
          <Button type="primary">导入</Button>
        </Input.Group>

        <Input.Group>
          {/*<Input placeholder='保存位置' />*/}
          <Radio.Group
            value={qualitySelect}
            onChange={(e: RadioChangeEvent) =>
              this.setState({ qualitySelect: e.target.value })
            }
          >
            <Radio value={1}>优先下载最高品质</Radio>
            <Radio value={2}>优先下载最低品质</Radio>
            <Radio value={3}>全部下载</Radio>
          </Radio.Group>
          <Checkbox>同时下载歌词</Checkbox>
          <Checkbox>同时下载封面</Checkbox>
          <Button
            type="primary"
            onClick={() => this.setState({ isModalOpen: true })}
          >
            下载当前列表所有歌曲
          </Button>
        </Input.Group>

        <Modal
          title="下载确认"
          open={isModalOpen}
          onCancel={() => this.setState({ isModalOpen: false })}
          confirmLoading={loading}
          onOk={() => this.download()}
        >
          <p>当前一共有 {dataSource.length} 首歌曲，确定全部下载吗？</p>
          <p>下载不支持断点续传，所以请尽量不要操作浏览器</p>
          {emptyCount == 0 ? (
            <></>
          ) : (
            <p style={{ color: 'red' }}>
              有 {emptyCount} 首歌曲没有资源!请确认任务是否执行完成
            </p>
          )}
        </Modal>
        <Table dataSource={dataSource} columns={columns} rowKey="id" />
      </div>
    );
  }
}
