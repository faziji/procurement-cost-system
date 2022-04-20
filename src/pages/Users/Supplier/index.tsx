import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Upload, Popover, Radio } from 'antd';
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
import UpdateForm from './components/UpdateForm';

import {
  getConsultationList,
  createtConsultation,
  deleteConsultations,
  updateConsultation,
} from '@/services/resources/api';
import {
  getSupplierList,
  updateSupplierDetail,
  deleteSuppliers,
  handleReview,
} from '@/services/supplier/api';

// 文件预览
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import moment from 'moment';

const Supplier: React.FC = () => {
  /**
   * 资格审核表单
   */
  const [reviewModalVisible, handleReviewModalVisible] = useState<boolean>(false);
  const [reviewValue, setReviewValue] = useState('supplier');
  const [reviewInfo, setReviewInfo] = useState('');

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

  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<any>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  // 上传成功
  const [uploadKey, setUploadKey] = useState('');
  const [uploadHash, setUploadHash] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');

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
      let res = await createtConsultation({ ...reqData });
      // 失败
      if (res?.code) throw false;

      hide();
      message.success('添加供应商成功！');
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
    // console.log('1111111111111111111', fields);

    const hide = message.loading('Configuring');
    try {
      await updateSupplierDetail(fields);
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
    console.log('selectedRows', selectedRows);

    if (!selectedRows) return true;
    try {
      await deleteSuppliers({
        ids: selectedRows.map((row: any) => row.id),
      });
      hide();
      message.success('Deleted successfully and will refresh soon');
      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
      tip: 'The company name is the unique key',
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
      title: '社会统一信用代码',
      dataIndex: 'username',
      valueType: 'textarea',
    },
    {
      title: '联系人姓名',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '联系人电话',
      dataIndex: 'phone',
      valueType: 'textarea',
    },
    {
      title: '联系人邮箱',
      dataIndex: 'email',
      valueType: 'textarea',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        enable: {
          text: '启用中',
          status: 'Success',
        },
        disable: {
          text: '已禁用',
          status: 'Error',
        },
      },
    },
    {
      title: '身份权限',
      dataIndex: 'role',
      hideInForm: true,
      valueEnum: {
        supplier: {
          text: '已通过',
          status: 'Success',
        },
        'supplier-reviewing': {
          text: '待通过',
          status: 'Processing',
        },
        'supplier-unaccess': {
          text: '审核不通过',
          status: 'Error',
        },
      },
    },
    {
      title: '评分',
      dataIndex: 'score',
      valueType: 'textarea',
    },
    {
      title: '审核人',
      dataIndex: 'reviewer',
      valueType: 'textarea',
    },
    {
      title: '邀请人',
      dataIndex: 'inviter',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_: any, record: any) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          更新
        </a>,
        <a
          key="config"
          onClick={() => {
            if (record?.role === 'supplier') {
              message.info('该用户身份权限已通过，无需重复审核！');
              return;
            } else if (record?.role === 'supplier-unaccess') {
              message.info(
                `该供应商已被【${record?.reviewer}】审核为不通过，反馈信息为：【${record?.reviewInfo}】需要供应商重新提交注册申请 或 管理员更新该供应商的注册信息。`,
                7,
              );
              return;
            }
            handleReviewModalVisible(true);
            setCurrentRow(record);
            setReviewInfo(currentRow?.reviewInfo);
          }}
        >
          审核
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        headerTitle="查询供应商"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
            disabled
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={getSupplierList}
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
              选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
            type="primary"
            danger
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      {reviewModalVisible ? (
        <ModalForm
          title="资格审核"
          width="1200px"
          visible={reviewModalVisible}
          onVisibleChange={handleReviewModalVisible}
          onFinish={async (value) => {
            console.log('提交的数据', value);

            const success = await updateSupplierDetail({
              username: currentRow?.username,
              role: reviewValue,
              reviewer: JSON.parse(localStorage?.getItem('userInfo') || '{}')?.name,
              reviewInfo: value?.reviewInfo,
            });
            if (success) {
              handleReviewModalVisible(false);
              // 有改动，关闭弹窗时也自动清空
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          {/* {JSON.stringify(currentRow)} */}
          {currentRow?.username && (
            <>
              <ProDescriptions
                column={2}
                title={currentRow?.username}
                request={async () => ({
                  data: currentRow || {},
                })}
                params={{
                  id: currentRow?.username,
                }}
                columns={columns}
              />
              <hr />
              是否通过该供应商的资格审核？
              <br />
              <Radio.Group onChange={(e) => setReviewValue(e.target.value)} value={reviewValue}>
                <Radio value="supplier">通过</Radio>
                <Radio value="supplier-unaccess">不通过</Radio>
              </Radio.Group>
              {reviewValue === 'supplier-unaccess' && (
                <ProFormTextArea
                  name="reviewInfo"
                  label="信息反馈"
                  rules={[
                    {
                      required: true,
                      message: '请输入不通过的信息反馈',
                    },
                  ]}
                  placeholder="信息反馈"
                />
              )}
            </>
          )}
        </ModalForm>
      ) : null}

      <UpdateForm
        onSubmit={async (value: any) => {
          const success = await handleUpdate(value);
          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

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
          <ProDescriptions
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

export default Supplier;
