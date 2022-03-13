import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Input, Upload, message } from 'antd';
import ProForm, {
  ProFormFieldSet,
  ProFormText,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import { queryCurrent, baseSettings } from '../service';

import styles from './BaseView.less';

// 验证电话号码格式
const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your phone number!');
  }
  callback();
};

// 获取返回加载图片的base64地址
const getBase64 = (img: any, callback: any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}


// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({ avatar }: { avatar: string }) => {
  let [avatarProps, setAvatarProps] = useState(avatar)
  const handleUploadAvatar = (info: any) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      // 获取返回图片的base64格式
      getBase64(info.file.originFileObj, (imageUrl: React.SetStateAction<string>) =>
        setAvatarProps(imageUrl)
      );
      message.success("更改头像成功！");
    } else if (info.file.status === 'error') {
      message.error("更改头像失败！");
    }
  }
  return (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatarProps} alt="avatar" />
      </div>
      <Upload data={{ username: localStorage.getItem("username") }} onChange={handleUploadAvatar} action="http://172.21.40.25:3000/api/user/uploadAvatar" showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            更换头像
          </Button>
        </div>
      </Upload>
    </>
  )
};

const BaseView: React.FC = () => {
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });

  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://a.msstatic.com/huya/main3/components/helperbar/img/mm_de16b.png';
      return url;
    }
    return '';
  };

  const handleFinish = async (data: any) => {
    let info = {
      ...data,
      phone: data.phone[0],
    }
    baseSettings(info).then(result => {
      message.success('更新基本信息成功');
    }
    ).catch(err => {
      message.error('更新基本信息失败');
    })
  };
  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                resetButtonProps: {
                  style: {
                    display: 'none',
                  },
                },
                submitButtonProps: {
                  children: '更新基本信息',
                },
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone?.split('-'),
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="昵称"
                rules={[
                  {
                    required: true,
                    message: '请输入您的昵称!',
                  },
                ]}
              />
              {/* <ProFormTextArea
                name="profile"
                label="个人简介"
                rules={[
                  {
                    required: true,
                    message: '请输入个人简介!',
                  },
                ]}
                placeholder="个人简介"
              /> */}
              <ProFormFieldSet
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                  { validator: validatorPhone },
                ]}
              >
                <Input className={styles.phone_number} />
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
