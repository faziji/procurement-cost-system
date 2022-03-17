import React from 'react';
import { Modal } from 'antd';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
  ProFormRadio,
  ProFormDateTimePicker,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import moment from 'moment';


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
            title="个人信息更新"
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
          companyName: props.values.companyName,
          username: props.values.username,
          joinDate: moment(props.values.joinDate).format("YYYY-MM-DD HH:mm:ss"),
        }}
        title="基本信息"
      >
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
            name="username"
            label="账户名"
            width="md"
            disabled
            rules={[
              {
                required: true,
                message: '请输入账户名!',
              },
            ]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="companyName"
            label="公司名称"
            width="md"
            disabled
            rules={[
              {
                required: true,
                message: '请输入公司名称!',
              },
            ]}
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
        <ProForm.Group>
          <ProFormSelect
            width="md"
            options={[
              {
                value: 'procurement',
                label: '采购部门',
              },
              {
                value: 'financial',
                label: '财务部门',
              },
              {
                value: 'specialist',
                label: '专家评审',
              },
              {
                value: 'hr',
                label: '人事部门',
              },
            ]}
            name="role"
            label="部门"
            rules={[
              {
                required: true,
                message: '请输入选择部门!',
              },
            ]}
          />
          <ProFormDatePicker
            name="joinDate"
            width="md"
            label="加入日期"
            rules={[
              {
                required: true,
                message: '请选择加入日期！',
              },
            ]}
          />

        </ProForm.Group>
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          username: props.values.username,
          creditCardNumber: props.values.creditCardNumber,
          birthday: moment(props.values.birthday).format("YYYY-MM-DD HH:mm:ss"),
          workPlace: props.values.workPlace,
          employeeId: props.values.employeeId,
          status: props.values.status,
          note: props.values.note,
        }}
        title={intl.formatMessage({
          id: 'pages.searchTable.UpdateForm.elseInfo',
          defaultMessage: '其他信息',
        })}
      >
        <ProForm.Group>
          <ProFormText
            name="creditCardNumber"
            label="银行卡号"
            width="md"
          />
          <ProFormDatePicker
            name="birthday"
            width="md"
            label="出生年月日"
          />

        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="workPlace"
            label="工作地点"
            width="md"
          />
          <ProFormText
            name="employeeId"
            label="工号"
            width="md"
          />
        </ProForm.Group>
        <ProForm.Group>
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
          <ProFormTextArea
            name="note"
            width="md"
            label="备注"
          />
        </ProForm.Group>
        {/* {JSON.stringify(props.values)} */}
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
