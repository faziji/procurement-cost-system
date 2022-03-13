import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps { }
// import { createStudents } from '../services/student/api'
import { createStudent } from '@/services/ant-design-pro/api';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FileViewer from 'react-file-viewer';
import { CustomErrorComponent } from 'custom-error';

// import Center from './account/center'
const TestPage: React.FC<IProps> = (props: IProps) => {
  const onClick = () => {
    console.log('da');
  };
  const createStudentsSubmit = () => {
    console.log('createStudentsSubmit');
    let obj: any = {
      name: '11111',
      age: 111,
      gender: '11111',
      grade: '11111',
    };
    let res = createStudent(obj);
  };
  const onChange = () => { };

  const onError = (e) => {
    console.log('显示错误');
  }

  return (
    <div>
      <input onClick={onClick} onChange={onChange} />
      <button onClick={createStudentsSubmit}>点击</button>
      {/* <a href="http://localhost:3000/files/18%E8%BD%AF%E4%B8%80%E8%AF%B8%E7%A5%A5%E5%8F%91.docx">点击下载</a> */}
      <hr />
      <FileViewer
        style={{ backgroundColor: "red" }}
        fileType="docx"
        filePath="http://r8dp8c34q.hn-bkt.clouddn.com/%E5%8F%91%E8%A8%80.docx"
        errorComponent={CustomErrorComponent}
        onError={onError} />
    </div>
  );
};

export default TestPage;
