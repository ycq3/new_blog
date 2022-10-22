// import React, { FC } from 'react';
// import { Button } from 'antd';
import './app.css';
import Footer from './pages/_common/footer';
import React from 'react';
import {
  BasicLayoutProps,
  Settings as LayoutSettings,
} from '@ant-design/pro-layout';
import { RequestConfig } from 'umi';

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings };
}): BasicLayoutProps => {
  return {
    // rightContentRender: () => <RightContent />,
    footerRender: () => <Footer />,
    onPageChange: () => {
      //   const { location } = history;
      // 如果没有登录，重定向到 login
      //   if (!currentUser && location.pathname !== '/user/login') {
      // history.push('/user/login');
      //   }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  prefix: 'https://api.dydq.xyz',
  timeout: 30000,
};
