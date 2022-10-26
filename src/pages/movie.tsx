import { HomeOutlined } from '@ant-design/icons';
import { Button, Input, Table, Modal, Radio, Checkbox, Image } from 'antd';
import type { RadioChangeEvent } from 'antd';
import React, { Component } from 'react';
import { request } from '@@/plugin-request/request';
import JoLPlayer, { videoType } from 'jol-player';

// import { FileSystemGetFileOptions } from 'wicg-file-system-access';

interface VideoUrl {
  name: string;
  url: string;
}

interface Movie {
  index: number;
  actor: string;
  area: string;
  name: string;
  content: string;
  director: string;
  play_url: Array<VideoUrl>;
  time: string;
  year: string;
  pic: string;
}

interface MovieState {
  data: Array<Movie>;
  currentPage: number;
  pageSize: number;
  total: number;
  name: string;
  isModalOpen: boolean;
  loading: boolean;
  qualitySelect: number;
  emptyCount: number;
  pin: number;
  verify: boolean;
  isNewListModalOpen: boolean;
  currentPlay: Movie | null;
  videoUrl: string;
}

export default class MoviePage extends Component<any, MovieState> {
  public static menu = {
    name: '电影', // 兼容此写法
    icon: <HomeOutlined />,
  };

  private dirHandle: FileSystemDirectoryHandle | undefined;

  state = {
    data: Array<Movie>(),
    currentPage: 1,
    pageSize: 15,
    total: 0,
    name: '',
    isModalOpen: false,
    loading: true,
    qualitySelect: 1,
    emptyCount: 0,
    verify: false,
    pin: 0,
    isNewListModalOpen: false,
    currentPlay: null,
    videoUrl: '',
  };

  componentDidMount() {
    if (process.env.NODE_ENV === 'development') {
      this.setState({ pin: 427485, name: '三悦' });
    }
    this.loadMovieList(this.state.name);
  }

  play(id: number) {
    console.log(id);
    const { data } = this.state;

    let currentPlay = data.at(id);
    if (currentPlay != null) {
      this.setState({
        currentPlay: currentPlay,
        isModalOpen: true,
        videoUrl: currentPlay.play_url.at(0)?.url ?? '',
      });
    }
    // let player = ;
  }

  add(playListId: number) {
    const { pin } = this.state;
    request('/api/song/play_list/add', {
      params: {
        playlist_id: playListId,
        key: pin,
      },
    }).then((resp) => {
      this.setState({ isNewListModalOpen: false });
    });
  }

  loadMovieList(name: string) {
    const { data } = this.state;
    this.setState({ loading: true });
    const { currentPage, pageSize } = this.state;
    request('/api/movie/search/', {
      params: {
        q: name,
      },
    }).then((resp) => {
      let respData = resp.data.map((item: Movie, i: number) => {
        item.index = i;
        return item;
      });
      this.setState({ data: [...data, ...respData] });
      this.setState({ loading: false });
    });
    // request('/api/songs/play_list/' + name, {
    //   params: {
    //     page: currentPage,
    //     pageSize: pageSize,
    //   },
    // }).then((resp) => {
    //   const { data, total } = resp;
    //   let emptyCount = 0;
    //   data.map((i: Movie) => {
    //     const qualityText = ['FLAC', 'm4a', '320K', '128K', 'ERROR'];
    //     i.qualityText = qualityText[i.quality - 1] ?? 'ERROR';
    //     if (i.quality > 4) {
    //       emptyCount++;
    //     }
    //     return i;
    //   });
    //
    //   this.setState({
    //     data: data,
    //     total: total,
    //     loading: false,
    //     emptyCount: emptyCount,
    //     isNewListModalOpen: data.length == 0,
    //   });
    // });
  }

  // async download() {
  //   if (this.dirHandle == null) {
  //     console.log('no permission');
  //     this.dirHandle = await window.showDirectoryPicker({
  //       startIn: 'music', //default folder
  //       writable: true, //ask for write permission
  //     });
  //     await this.download();
  //   }
  //
  //   const { data } = this.state;
  //   // this.dirHandle
  //
  //   for (const i of data) {
  //     if (i.quality < 5) {
  //       await this.getBlob(i);
  //     }
  //   }
  // }

  // async getBlob(s: Movie) {
  //   const urlToGet = 'api/song/' + s.id + '/' + s.quality;
  //   const data = await fetch(urlToGet);
  //   if (data.status != 200) {
  //     s.status = '服务器错误:' + data.statusText;
  //     return;
  //   }
  //
  //   const ext: string | null = data.headers.get('FileExt');
  //   if (ext == null) {
  //     return;
  //   }
  //
  //   // return data.blob();
  //
  //   const filename = (s.name + '-' + s.artist + ext).replaceAll(
  //     /[\\\\/:*?\"<>|]/g,
  //     '',
  //   );
  //   // console.log(filename);
  //   s.status = '开始下载' + filename;
  //
  //   const fileHandle = await this.dirHandle?.getFileHandle(filename, {
  //     create: true,
  //   });
  //
  //   if (fileHandle == null) {
  //     console.error('get file handle' + fileHandle);
  //     return;
  //   }
  //
  //   console.log(fileHandle);
  //
  //   if (await this.verifyPermission(fileHandle, true)) {
  //     const writable = await fileHandle.createWritable();
  //     await writable.write(await data.blob());
  //     await writable.close();
  //     s.status = '下载完成';
  //   }
  // }

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

  renderButton(currentPlay: Movie | null) {
    // const { currentPlay } = this.state;
    if (currentPlay == null) {
      return <></>;
    }

    // @ts-ignore
    let button = currentPlay.play_url.map((item, i) => (
      <Button
        key={i}
        onClick={() => {
          this.setState({ videoUrl: item.url });
        }}
      >
        {item.name}
      </Button>
    ));
    return <>{button}</>;
  }

  render(): React.ReactNode {
    const dataSource = this.state.data;

    const columns = [
      {
        title: '图片',
        dataIndex: 'pic',
        render: (text: string) => {
          return <Image src={text} height={'auto'} width={'100px'} />;
        },
      },
      {
        title: '片名',
        dataIndex: 'name',
      },
      {
        title: '导演',
        dataIndex: 'director',
      },
      {
        title: '演员',
        dataIndex: 'actor',
      },
      {
        title: '地区',
        dataIndex: 'area',
      },
      {
        title: '语言',
        dataIndex: 'lang',
      },
      {
        title: '年份',
        dataIndex: 'year',
      },
      {
        title: '更新时间',
        dataIndex: 'time',
      },
      {
        title: '播放',
        dataIndex: 'index',
        render: (id: number) => {
          return <Button onClick={() => this.play(id)}>播放</Button>;
        },
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

    const {
      isModalOpen,
      videoUrl,
      // player,
      emptyCount,
      name,
      pin,
      verify,
      currentPlay,
    } = this.state;

    let videoType: videoType = videoUrl.endsWith('m3u8') ? 'hls' : 'h264';

    return (
      <div>
        <h3>由于版权原因，不对外开放,交流请扫码关注公众号</h3>
        <div style={{ display: 'flex' }}>
          <Input.Group compact style={{ width: '400px' }}>
            <Input
              placeholder="输入暗号"
              style={{ width: '300px' }}
              status={'error'}
              onChange={(e) => this.setState({ pin: Number(e.target.value) })}
              disabled={verify}
            />
            <Button
              type="primary"
              onClick={() => {
                if (pin == 427485) {
                  this.setState({ verify: true });
                }
              }}
              disabled={verify}
            >
              验证
            </Button>
          </Input.Group>
          <Input.Group compact style={{ width: '400px' }}>
            <Input
              placeholder="输入片名"
              style={{ width: '300px' }}
              disabled={!verify}
              onChange={(e) => this.setState({ name: String(e.target.value) })}
              value={name}
            />
            <Button
              type="primary"
              onClick={() => {
                this.loadMovieList(name);
              }}
              disabled={!verify || name.length == 0}
            >
              搜索
            </Button>
          </Input.Group>
        </div>
        {/*<Input.Group>*/}
        {/*  /!*<Input placeholder='保存位置' />*!/*/}
        {/*  <Radio.Group*/}
        {/*    value={qualitySelect}*/}
        {/*    onChange={(e: RadioChangeEvent) =>*/}
        {/*      this.setState({ qualitySelect: e.target.value })*/}
        {/*    }*/}
        {/*  >*/}
        {/*    <Radio value={1}>优先下载最高品质</Radio>*/}
        {/*    <Radio value={2} disabled={true}>*/}
        {/*      优先下载最低品质*/}
        {/*    </Radio>*/}
        {/*    <Radio value={3} disabled={true}>*/}
        {/*      全部下载*/}
        {/*    </Radio>*/}
        {/*  </Radio.Group>*/}
        {/*  <Checkbox disabled={true}>同时下载歌词</Checkbox>*/}
        {/*  <Checkbox disabled={true}>同时下载封面</Checkbox>*/}
        {/*  <Button*/}
        {/*    disabled={!verify}*/}
        {/*    type="primary"*/}
        {/*    onClick={() => this.setState({ isModalOpen: true })}*/}
        {/*  >*/}
        {/*    下载当前列表所有歌曲*/}
        {/*  </Button>*/}
        {/*</Input.Group>*/}

        <Image src={require('@/image/wechat.png')} height={'100px'} />
        <Image src={require('@/image/donate.png')} height={'100px'} />

        <Modal
          title={currentPlay?.name}
          open={isModalOpen}
          onCancel={() => this.setState({ isModalOpen: false })}
          footer={null}
          width={750 + 24 * 2}
          destroyOnClose={true}
        >
          <JoLPlayer
            style={{ marginTop: 30, marginBottom: 10 }}
            option={{
              videoSrc: videoUrl,
              width: 750,
              height: 420,
              videoType: videoType,
            }}
          />
          {this.renderButton(currentPlay)}
        </Modal>
        {/*<Modal*/}
        {/*  title='创建导入任务'*/}
        {/*  open={isNewListModalOpen}*/}
        {/*  onCancel={() => this.setState({ isNewListModalOpen: false })}*/}
        {/*  confirmLoading={loading}*/}
        {/*  onOk={() => this.add(name)}*/}
        {/*>*/}
        {/*  <p>歌单不存在需要导入，处理过程需要1-2小时，请勿重复提交</p>*/}
        {/*  <p>*/}
        {/*    服务器流量成本不菲，如果这个工具帮助到了你，你可以捐助我们，一遍我们持续运行*/}
        {/*  </p>*/}
        {/*</Modal>*/}
        <Table
          dataSource={dataSource}
          columns={columns}
          key={'index'}
          pagination={false}
        />
      </div>
    );
  }
}
