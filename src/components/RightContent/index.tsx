import { Space, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { useModel, SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import NoticeIconView from '../NoticeIcon';

export type SiderTheme = 'light' | 'dark';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  if (!initialState || !initialState.settings) {
    return null;
  }

  const { navTheme, layout } = initialState.settings;
  let className = styles.right;

  if ((navTheme === 'dark' && layout === 'top') || layout === 'mix') {
    className = `${styles.right}  ${styles.dark}`;
  }
  const role = JSON.parse(localStorage.getItem('userInfo') || '{}')?.role;

  // console.log('eeeeeeeeeeeeeeeeeee', userInfo);

  return (
    <Space className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue=""
        options={[
          { label: <a href="/welcome">数据统计</a>, value: '数据统计' },
          {
            label: <a href="/system/result-announcement">结果公告</a>,
            value: '结果公告',
          },
          {
            label: <a href="/system/consultation">征询意见</a>,
            value: '征询意见',
          },
          {
            label: <a href="/Financial/contract">合同管理</a>,
            value: '合同管理',
          },
        ]}
        // onSearch={value => {
        //   console.log('input', value);
        // }}
      />
      {/* <span
        className={styles.action}
        onClick={() => {
          window.open('https://pro.ant.design/docs/getting-started');
        }}
      >
        <QuestionCircleOutlined />
      </span> */}
      <NoticeIconView />
      <Avatar />
      {/* <Tag color="green">{role}</Tag> */}
      {role === 'procurement' && (
        <Tag color="green" key={role}>
          采购部门
        </Tag>
      )}
      {role === 'financial' && (
        <Tag color="orange" key={role}>
          财务部门
        </Tag>
      )}
      {role === 'specialist' && (
        <Tag color="blue" key={role}>
          专家评审
        </Tag>
      )}
      {role === 'hr' && (
        <Tag color="pink" key={role}>
          人事部门
        </Tag>
      )}
    </Space>
  );
};
export default GlobalHeaderRight;
