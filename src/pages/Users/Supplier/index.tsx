import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Upload, Popover } from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormDateTimePicker, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import UpdateForm from './components/UpdateForm';

import { getConsultationList, createtConsultation, deleteConsultations, updateConsultation } from '@/services/resources/api'

// 文件预览
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import moment from 'moment';


const Supplier: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建窗口的弹窗
   *  */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const handleModalVisibleMethod = (value: any) => {
    handleModalVisible(value)
    setUploadName('')
    setUploadKey('')
    setUploadHash('')
    setUploadUrl('')
  }


  /**
   * @en-US The pop-up window of the distribution update window
   * @zh-CN 分布更新窗口的弹窗
   * */
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  // 上传成功
  const [uploadKey, setUploadKey] = useState("")
  const [uploadHash, setUploadHash] = useState("")
  const [uploadUrl, setUploadUrl] = useState("")
  const [uploadName, setUploadName] = useState("")

  /**
   * 新建表格预览
   */
  const onError = (e: any) => {
    console.log('显示错误');
  }


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
      publishTime: moment().format("YYYY-MM-DD HH:mm:ss")
    }

    let reqData = {
      ...fields,
      ...addValue,
    }

    // 未上传文件
    const { hash, key } = reqData
    if (!hash || !key) {
      message.error('请先上传文件！');
      return false;
    }

    const hide = message.loading('正在添加');
    try {
      let res = await createtConsultation({ ...reqData });
      // 失败
      if (res?.code) throw false


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
      await updateConsultation(fields);
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
      await deleteConsultations({
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

  /**
   * 确认删除当前节点
   */
  // const onConfirmDelete = (record: any) => {
  //   console.log('删除的是', record);
  // }

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: <FormattedMessage id="pages.searchTable.ID" defaultMessage="ID" />,
      dataIndex: 'id',
      valueType: 'textarea',
    },
    {
      title: "意见名称",
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
      title: "意见描述",
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: "状态",
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
            <FormattedMessage id="pages.searchTable.nameStatus.finished" defaultMessage="Finished" />
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
      title: "发布人",
      dataIndex: 'publisher',
      valueType: 'textarea',
    },
    {
      title: "发布时间",
      dataIndex: 'publishTime',
      valueType: 'textarea',
    },
    {
      title: "生效时间",
      dataIndex: 'startTime',
      valueType: 'textarea',
    },
    {
      title: "结束时间",
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
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          配置
        </a>
      ],
    },
  ];

  /**
   * 弹窗预览
   */
  const content = () => {
    return (
      <div>
        <FileViewer
          style={{ backgroundColor: "red" }}
          fileType="docx"
          filePath={uploadUrl || ''}
          errorComponent={CustomErrorComponent}
          onError={onError} />
      </div>
    )
  }

  const handleUploadConsultation = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      let fileListLength = info.fileList.length - 1
      let { key, hash, resourceUrl, name } = info.fileList[fileListLength].response.data
      setUploadKey(key)
      setUploadHash(hash)
      setUploadUrl(resourceUrl)
      setUploadName(name)

      message.success("上传成功");
    } else if (info.file.status === 'error') {
      message.error("上传失败！");
    }
  }

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
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
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={getConsultationList}
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
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      {/* 关闭即销毁 */}
      {createModalVisible ?
        <ModalForm
          title={intl.formatMessage({
            id: 'pages.searchTable.createForm.newRule',
            defaultMessage: 'New rule',
          })}
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
          <div style={{ margin: "30px" }}>
            <Upload data={{ token: localStorage.getItem("token") }} onChange={handleUploadConsultation} action="http://172.21.40.25:3000/api/resource/uploadResource" showUploadList={false}>
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
              label="意见名称："
            />
            <ProFormDateTimePicker
              name="startTime"
              width="md"
              label="意见生效时间"
              rules={[
                {
                  required: true,
                  message: '请选择意见生效时间！',
                },
              ]}
            />
            <ProFormDateTimePicker
              name="endTime"
              width="md"
              label="意见结束时间"
              rules={[
                {
                  required: true,
                  message: '请选择意见结束时间！',
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
        </ModalForm> : null}

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
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default Supplier;
