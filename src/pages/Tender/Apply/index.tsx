import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getPurchaseAnnouncementList } from '@/services/resources/api';
import { getTenderList } from '@/services/tender/api';

const Apply: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [tenderData, setTenderData] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: '投标项目名称',
      dataIndex: 'name',
      tip: 'The file name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              searchTenderList(entity);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        0: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.default"
              defaultMessage="Unpublished"
            />
          ),
          status: 'Default',
        },
        1: {
          text: (
            <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
          ),
          status: 'Processing',
        },
        2: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.finished"
              defaultMessage="Finished"
            />
          ),
          status: 'Error',
        },
        3: {
          text: (
            <FormattedMessage
              id="pages.searchTable.nameStatus.abnormal"
              defaultMessage="Abnormal"
            />
          ),
          status: 'Error',
        },
      },
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      valueType: 'textarea',
    },
    {
      title: '生效时间',
      dataIndex: 'startTime',
      valueType: 'textarea',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      valueType: 'textarea',
    },
  ];
  const columnsDetails: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: '采购公告名称',
      dataIndex: 'announcementName',
      valueType: 'textarea',
    },
    {
      title: '供应商',
      dataIndex: 'supplierUsername',
      valueType: 'textarea',
    },
    {
      title: '投标金额(元)',
      dataIndex: 'amount',
      valueType: 'number',
    },
    {
      title: '附件',
      dataIndex: 'attachment',
      valueType: 'textarea',
    },
    {
      title: '投标时间',
      dataIndex: 'createdAt',
      valueType: 'textarea',
    },
  ];

  const searchTenderList = async (entity: any) => {
    console.log('点击了确认');
    await getTenderList({ announcementId: entity?.id })
      .then((result) => {
        const { data } = result;
        if (!data?.length) {
          message.info('该项目无投标记录！');
          return;
        }
        setShowDetail(true);
        setTenderData(data);
        console.log('请求成功', result);
      })
      .catch((err) => {
        console.log('发生了错误', err);
      });
  };

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="查询投标项目（点击项目名称查看投标详情）"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={getPurchaseAnnouncementList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {showDetail ? (
        <Modal
          title={currentRow?.name + '投标记录' || '详情'}
          visible={showDetail}
          onCancel={() => setShowDetail(false)}
          footer={
            [] // 设置footer为空，去掉 取消 确定默认按钮
          }
          width={1500}
        >
          <ProTable
            headerTitle="查询投标项目详情"
            actionRef={actionRef}
            rowKey="id"
            search={{
              labelWidth: 120,
            }}
            params={{ announcementId: currentRow?.id }}
            request={getTenderList}
            columns={columnsDetails}
          />
        </Modal>
      ) : null}
    </PageContainer>
  );
};

export default Apply;
