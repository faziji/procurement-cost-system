import React from 'react';
import { Modal } from 'antd';
import {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
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
            width={640}
            bodyStyle={{ padding: '32px 40px 48px' }}
            destroyOnClose
            title="配置"
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
          description: props.values.description,
          endTime: props.values.endTime,
          startTime: props.values.startTime,
          key: props.values.key,
          id: props.values.id
        }}
        title="基本信息"
      >
        <ProFormText
          name="id"
          label="ID"
          width="md"
          disabled
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
        <ProFormTextArea
          name="description"
          width="md"
          label="意见描述"
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        initialValues={{
          type: '1',
          frequency: 'month',
        }}
        title="选择关联公告"
      >
        <ProFormDateTimePicker
          name="time"
          width="md"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.schedulingPeriod.timeLabel',
            defaultMessage: '开始时间',
          })}
        />
        <ProFormSelect
          name="frequency"
          label={intl.formatMessage({
            id: 'pages.searchTable.updateForm.object',
            defaultMessage: '监控对象',
          })}
          width="md"
          valueEnum={{
            month: '月',
            week: '周',
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default UpdateForm;
