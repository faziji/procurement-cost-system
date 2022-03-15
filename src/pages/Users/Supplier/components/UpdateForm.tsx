import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';


const UpdateForm: React.FC<any> = (props) => {
  const intl = useIntl();
  return (
    <StepsForm
      stepsProps={{
        size: 'small',
      }}
      stepsFormRender={(dom, submitter) => {
        return (
          <Modal
            width={1200}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title={intl.formatMessage({
              id: 'pages.searchTable.UpdateForm.Supplier',
              defaultMessage: '供应商更新',
            })}
            visible={props.updateModalVisible}
            footer={submitter}
            onCancel={() => {
              props.onCancel();
            }}
          >
            {dom}
          </Modal>
        );
      }}
      onFinish={props.onSubmit}
    >
      <StepsForm.StepForm
        initialValues={{
          name: props.values.name,
          phone: props.values.phone,
          email: props.values.email,
          status: props.values.status,
          role: props.values.role,
          id: props.values.id,
          score: props.values.score,
          shoukuanAccount: props.values.shoukuanAccount,
          fukuanAccount: props.values.fukuanAccount,
          fukuan: props.values.fukuan,
          shoukuan: props.values.shoukuan,
          inviter: props.values.inviter,
          note: props.values.note,
          companyName: props.values.companyName,
          username: props.values.username,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.updateForm.basicConfig',
          defaultMessage: '基本信息',
        })}
      >
        {/* {JSON.stringify(props.values)} */}
        <ProForm.Group>
          <ProFormText
            name="id"
            label={intl.formatMessage({
              id: 'pages.searchTable.updateForm.ruleName.ID',
              defaultMessage: 'ID',
            })}
            width="md"
            rules={[
              {
                required: true,
                message: '请输入id!',
              },
            ]}
            disabled
          />
          <ProFormText
            name="name"
            label="联系人姓名"
            width="md"
            rules={[
              {
                required: true,
                message: '请输入联系人姓名!',
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="companyName"
            label="公司名称"
            width="md"
            rules={[
              {
                required: true,
                message: '请输入公司名称!',
              },
            ]}
          />

          <ProFormText
            name="username"
            label="社会统一信用代码"
            width="md"
            rules={[
              {
                required: true,
                message: '请输入社会统一信用代码!',
              },
            ]}
          />

        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="phone"
            label="联系人电话"
            width="md"
            rules={[
              {
                required: true,
                message: '请输入联系人电话!',
              },
            ]}
          />

          <ProFormText
            name="email"
            label="联系人邮箱"
            width="md"
            rules={[
              {
                required: true,
                message: '请输入联系人邮箱!',
              },
            ]}
          />

        </ProForm.Group>


      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.UpdateForm.elseInfo',
          defaultMessage: '其他信息',
        })}
      >
        <ProForm.Group>
          <ProFormText
            name="fukuan"
            label="付款人/付款公司"
            width="md"
          />
          <ProFormText
            name="shoukuan"
            label="收款人/收款公司"
            width="md"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="shoukuanAccount"
            label="收款账户"
            width="md"
          />
          <ProFormText
            name="fukuanAccount"
            label="付款账户"
            width="md"
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="inviter"
            label="邀请人"
            width="md"
          />
          <ProFormTextArea
            name="note"
            width="md"
            label="备注"
          />
        </ProForm.Group>
        <ProFormRadio.Group
          name="status"
          label="账号状态"
          options={[
            {
              label: '正常状态',
              value: 'enable',
            },
            {
              label: '停用',
              value: 'disable',
            },
          ]}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
