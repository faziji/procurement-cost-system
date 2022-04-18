import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal, Descriptions, Alert } from 'antd';
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
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            // handleUpdateModalVisible(true);
            setCurrentRow(record);
            searchTenderList(record);
          }}
        >
          生成结果
        </a>,
      ],
    },
  ];
  const columnsDetails: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'textarea',
    },
    // {
    //   title: '采购公告名称',
    //   dataIndex: 'announcementName',
    //   valueType: 'textarea',
    // },
    {
      title: '供应商信用代码',
      dataIndex: 'supplierUsername',
      valueType: 'textarea',
    },
    {
      title: '供应商名称',
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
          {/* {JSON.stringify(currentRow)} */}
          {currentRow?.status == 4 && <Alert message="已生成结果" type="success" showIcon />}
          <Descriptions title="项目信息">
            <Descriptions.Item label="项目名称">{currentRow?.name}</Descriptions.Item>
            <Descriptions.Item label="项目描述">{currentRow?.description}</Descriptions.Item>
            <Descriptions.Item label="项目状态">
              {currentRow?.status == 0
                ? '未发布'
                : currentRow?.status == 1
                ? '已上线'
                : currentRow?.status == 2
                ? '已结束'
                : currentRow?.status == 3
                ? '已终止'
                : '已生成结果报告'}
            </Descriptions.Item>
            <Descriptions.Item label="开始时间">{currentRow?.startTime}</Descriptions.Item>
            <Descriptions.Item label="结束时间">{currentRow?.endTime}</Descriptions.Item>
            <Descriptions.Item label="发布时间">{currentRow?.publishTime}</Descriptions.Item>
          </Descriptions>
          ,
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
            toolBarRender={() => [
              <Button
                type="primary"
                key="primary"
                onClick={() => {
                  console.log('生成结果');
                }}
                disabled={currentRow?.status == 4}
              >
                生成结果
              </Button>,
            ]}
          />
        </Modal>
      ) : null}
    </PageContainer>
  );
};

export default Apply;
