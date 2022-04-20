import styles from './global.less';
const loadingPic = require('@/resources/loading.webp');

const Loading: React.FC = (props: any) => {
  return (
    <div className={styles.contentWrapper}>
      <img src={loadingPic} alt="加载中..." />
    </div>
  );
};

export default Loading;
