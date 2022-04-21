import { Button, message, Drawer, Modal, Descriptions, Alert, Divider, Result, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getPurchaseAnnouncementList } from '@/services/resources/api';
import { getTenderList, createResult, getResultList } from '@/services/tender/api';

const Apply: React.FC = () => {
  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [tenderData, setTenderData] = useState<any>();
  const [confirmModalVisiable, setConfirmModalVisiable] = useState<any>(false);
  const [maxAmount, setMaxAmount] = useState<any>(0);
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [maxAmountItem, setMaxAmountItem] = useState<any>(0);
  const [haveResult, setHaveResult] = useState<any>(false);
  const [resultInfo, setResultInfo] = useState<any>(false);

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
      width: 100,
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
      width: 100,
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
      title: '投标时间',
      dataIndex: 'createdAt',
      valueType: 'textarea',
    },
  ];

  const searchTenderList = async (entity: any) => {
    await getTenderList({ announcementId: entity?.id })
      .then((result) => {
        const { data } = result;
        if (!data?.length) {
          message.info('该项目无投标记录！');
          return;
        }
        setShowDetail(true);
        setTenderData(data);
        // console.log('请求成功', result);
      })
      .catch((err) => {
        console.log('发生了错误', err);
      });

    // 获取投标结果，查看是否已生成结果
    // {id: currentRow?.id}
    await getResultList({ announcementId: 1 })
      .then((result) => {
        console.log('返回了投标结果', result);
        if (result?.data?.length) {
          setHaveResult(true);
          setResultInfo(result?.data[0]);
        }
      })
      .catch((err) => {
        console.log('getResultList error');
      });
  };

  const handleCreateResult = async () => {
    let maxAmount = Math.max.apply(
      Math,
      tenderData.map((item: any) => {
        return item.amount;
      }),
    );

    let maxAmountItem = tenderData.filter((item: { amount: number }) => item.amount == maxAmount);
    setMaxAmount(maxAmount);
    // 存在bug，只取第一个结果
    setMaxAmountItem(maxAmountItem[0]);

    setConfirmModalVisiable(true);
    // 确认框
    console.log('点击了生成结果', maxAmount, maxAmountItem, tenderData);
  };

  const handleConfirmOk = async () => {
    const { amount, supplierUsername, supplierName } = maxAmountItem;
    const { name, id: announcementId, name: announcementName } = currentRow;
    const info = {
      amount,
      supplierUsername,
      supplierName,
      name,
      announcementName,
      announcementId,
      attachment: '1',
    };
    await createResult(info)
      .then((result) => {
        console.log('生成结果成功！', result);
        message.success('生成结果成功！');
        // 关闭弹窗
        setConfirmModalVisiable(false);
        setShowDetail(false);
      })
      .catch((err) => {
        console.log('网络异常，稍后请重试！');
        message.error('网络异常，稍后请重试！');
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
      <Modal
        title={currentRow?.name + '投标记录' || '详情'}
        visible={showDetail}
        onCancel={() => setShowDetail(false)}
        footer={
          [] // 设置footer为空，去掉 取消 确定默认按钮
        }
        width={1500}
      >
        {haveResult && (
          <Alert
            message={
              <>
                <Descriptions title="开标结果信息">
                  <Descriptions.Item label="中标供应商全国统一信用代码">
                    {resultInfo?.supplierUsername}
                  </Descriptions.Item>
                  <Descriptions.Item label="中标供应商名称">
                    {resultInfo?.supplierName}
                  </Descriptions.Item>
                  <Descriptions.Item label="中标金额">
                    {resultInfo?.amount} （元）
                  </Descriptions.Item>
                  <Descriptions.Item label="中标时间">{resultInfo?.createdAt}</Descriptions.Item>
                </Descriptions>
              </>
            }
            type="success"
            showIcon
          />
        )}
        <Descriptions title="项目信息">
          <Descriptions.Item label="项目名称">{currentRow?.name}</Descriptions.Item>
          <Descriptions.Item label="项目描述">{currentRow?.description}</Descriptions.Item>
          <Descriptions.Item label="项目状态">
            {currentRow?.status == 0 ? (
              <Tag color="gray">未发布</Tag>
            ) : currentRow?.status == 1 ? (
              <Tag color="blue">已上线</Tag>
            ) : currentRow?.status == 2 ? (
              <Tag color="red">已结束(下线)</Tag>
            ) : (
              <Tag color="red">已终止(下线)</Tag>
            )}
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
            <Tag color="red">{haveResult && '该项目已生成结果！'}</Tag>,
            <Button
              type="primary"
              key="primary"
              onClick={(value) => {
                // console.log('生成结果');
                handleCreateResult(value);
              }}
              disabled={currentRow?.status == 4 || haveResult}
            >
              生成结果
            </Button>,
          ]}
        />
      </Modal>
      )
      {showDetail && (
        <Modal
          visible={showDetail && confirmModalVisiable}
          onCancel={() => setConfirmModalVisiable(false)}
          width={1000}
          title="中标信息结果信息确认"
          onOk={handleConfirmOk}
        >
          <h2>中标金额：{maxAmount}</h2>
          <Divider />
          <Descriptions title="中标供应商信息">
            <Descriptions.Item label="供应商名称">{maxAmountItem?.supplierName}</Descriptions.Item>
            <Descriptions.Item label="供应商全国统一信用代码">
              {maxAmountItem?.supplierUsername}
            </Descriptions.Item>
            <Descriptions.Item label="投标时间">{maxAmountItem?.createdAt}</Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
    </PageContainer>
  );
};

export default Apply;
