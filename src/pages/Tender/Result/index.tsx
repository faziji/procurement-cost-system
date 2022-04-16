import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Upload, Popover } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
  ModalForm,
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';

import { getResultList } from '@/services/tender/api';

import {
  getPurchaseAnnouncementList,
  updatePurchaseAnnouncement,
  createPurchaseAnnouncement,
  deletePurchaseAnnouncements,
} from '@/services/resources/api';

// 文件预览
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import moment from 'moment';

const Result: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const handleModalVisibleMethod = (value: any) => {
    handleModalVisible(value);
    setUploadName('');
    setUploadKey('');
    setUploadHash('');
    setUploadUrl('');
  };

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  // 上传成功
  const [uploadKey, setUploadKey] = useState('');
  const [uploadHash, setUploadHash] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');

  /**
   * 新建表格预览
   */
  const onError = (e: any) => {
    console.log('显示错误');
  };

  /**
   * @en-US Add node
   * @zh-CN 添加节点
   * @param fields
   */
  const handleAdd = async (fields: any) => {
    let addValue = {
      publisher: localStorage.getItem('username'),
      hash: uploadHash,
      key: uploadKey,
      publishTime: moment().format('YYYY-MM-DD HH:mm:ss'),
    };

    let reqData = {
      ...fields,
      ...addValue,
    };

    // 未上传文件
    const { hash, key } = reqData;
    if (!hash || !key) {
      message.error('请先上传文件！');
      return false;
    }

    const hide = message.loading('正在添加');
    try {
      let res = await createPurchaseAnnouncement({ ...reqData });
      // 失败
      if (res?.code) throw false;
      hide();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  /**
   * @en-US Update node
   * @zh-CN 更新节点
   *
   * @param fields
   */
  const handleUpdate = async (fields: any) => {
    console.log('1111111111111111111', fields);

    const hide = message.loading('Configuring');
    try {
      let res = await updatePurchaseAnnouncement(fields);
      if (res?.code) throw false;
      hide();

      message.success('Configuration is successful');
      return true;
    } catch (error) {
      hide();
      message.error('Configuration failed, please try again!');
      return false;
    }
  };

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param selectedRows
   */
  const handleRemove = async (selectedRows: any) => {
    const hide = message.loading('正在删除');
    if (!selectedRows) return true;
    try {
      let res = await deletePurchaseAnnouncements({
        ids: selectedRows.map((row: any) => row.id),
      });
      if (res?.code) throw false;
      hide();
      message.success('Deleted successfully and will refresh soon');
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: '成交结果名称',
      dataIndex: 'name',
      tip: 'The file name is the unique key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '关联采购公告id',
      dataIndex: 'announcementId',
      valueType: 'textarea',
    },
    {
      title: '关联采购公告名称',
      dataIndex: 'announcementName',
      valueType: 'textarea',
    },
    {
      title: '成交供应商信用代码',
      dataIndex: 'supplierUsername',
      valueType: 'textarea',
    },
    {
      title: '成交供应商名称',
      dataIndex: 'supplierName',
      valueType: 'textarea',
    },
    {
      title: '成交金额',
      dataIndex: 'amount',
      valueType: 'textarea',
    },
    {
      title: '财务结算时间',
      dataIndex: 'createdAt',
      valueType: 'textarea',
    },
  ];

  /**
   * 弹窗预览
   */
  const content = () => {
    return (
      <div>
        <FileViewer
          fileType="docx"
          filePath={uploadUrl || ''}
          errorComponent={CustomErrorComponent}
          onError={onError}
        />
      </div>
    );
  };

  const handleUploadConsultation = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      let fileListLength = info.fileList.length - 1;
      let { key, hash, resourceUrl, name } = info.fileList[fileListLength].response.data;
      setUploadKey(key);
      setUploadHash(hash);
      setUploadUrl(resourceUrl);
      setUploadName(name);

      message.success('上传成功');
    } else if (info.file.status === 'error') {
      message.error('上传失败！');
    }
  };

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle="查询成交结果"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            disabled
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getResultList}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              <FormattedMessage id="pages.searchTable.chosen" defaultMessage="Chosen" />{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              <FormattedMessage id="pages.searchTable.item" defaultMessage="项" />
              &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            danger
            type="primary"
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      {/* 关闭即销毁 */}
      {createModalVisible ? (
        <ModalForm
          title="新建成交结果"
          width="1200px"
          visible={createModalVisible}
          onVisibleChange={handleModalVisibleMethod}
          onFinish={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              // 有改动，关闭弹窗时也自动清空
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          <div style={{ margin: '30px' }}>
            <Upload
              data={{ token: localStorage.getItem('token') }}
              onChange={handleUploadConsultation}
              action="http://localhost:3000/api/resource/uploadResource"
              showUploadList={false}
            >
              <Button>
                <UploadOutlined />
                上传文件
              </Button>
            </Upload>
            <Popover content={content} title="文件预览" trigger="hover" placement="right">
              <a href={uploadUrl}>{uploadName}</a>
            </Popover>
          </div>
          <ProForm.Group>
            <ProFormText
              rules={[
                {
                  required: true,
                  message: (
                    <FormattedMessage
                      id="pages.searchTable.createForm.InputNameLabel"
                      defaultMessage="file name is required"
                    />
                  ),
                },
              ]}
              width="md"
              name="name"
              label="公告名称："
            />
            <ProFormDateTimePicker
              name="startTime"
              width="md"
              label="生效时间"
              rules={[
                {
                  required: true,
                  message: '请选择生效时间！',
                },
              ]}
            />
            <ProFormDateTimePicker
              name="endTime"
              width="md"
              label="结束时间"
              rules={[
                {
                  required: true,
                  message: '请选择结束时间！',
                },
              ]}
            />
            <ProFormTextArea width="md" label="描述" name="description" />
            <ProFormRadio.Group
              label="发布类型"
              name="statusType"
              initialValue="新建暂不发布"
              options={['新建暂不发布', '新建并发布']}
            />
          </ProForm.Group>
        </ModalForm>
      ) : null}

      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Result;
