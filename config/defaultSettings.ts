import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  primaryColor: '#FAAD14',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '采购和费控管理后台',
  pwa: false,
  logo: 'https://hyweb-test.oss-cn-shenzhen.aliyuncs.com/extension/pic/e577f6f7/ad4665a847_1597888775639.png',
  iconfontUrl: '',
};

export default Settings;
