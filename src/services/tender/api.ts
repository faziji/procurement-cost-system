import { history } from 'umi';
import { extend } from 'umi-request';
import { notification } from 'antd';
import { getToken } from '../../utils/index';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): any => {
  const { response } = error;
  if (response && response.status) {
    // const errorText = codeMessage[response.status] || response.statusText;
    // const { status, url } = response;
    // // 处理参数问题
    // let noParamUrl = url;
    // if (url.indexOf('?') !== -1) {
    //   noParamUrl = url.substring(0, url.indexOf('?'));
    // }
    // if (url.indexOf('/system/oauth/token') !== -1) {
    //   notification.error({
    //     message: `请求错误 [20002]: ${noParamUrl}`,
    //     description: '账号不存在或密码错误',
    //   });
    //   return response;
    // }
    // if (status === 401) {
    //   notification.warn({
    //     message: '请重新登陆!',
    //   });
    //   clearTokens();
    //   history.push('/user/login');
    // } else {
    //   notification.error({
    //     message: `请求错误 [${status}]: ${noParamUrl}`,
    //     description: errorText,
    //   });
    // }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 所以请求拦截器
 */
request.interceptors.request.use((url, options): any => {
  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: getToken() || '',
      },
    },
  };
});

// 响应
request.interceptors.response.use((res) => {
  const { status } = res;

  // 没有token直接跳转登录页
  if (status == 401) {
    notification.error({
      description: '用户没有权限（令牌、用户名、密码错误），重新登录...',
      message: 'no token',
    });

    // 清除token
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userInfo');
    // jump login
    history.push('/user/login');
  }
  return res;
});


/** 获取投标记录列表 GET /api/tender/getTenderList */
export async function getTenderList(
  params: any,
  options?: { [key: string]: any },
) {
  return request<any>('/api/tender/getTenderList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 获取成交结果列表 GET /api/tender/getResultList */
export async function getResultList(
  params: any,
  options?: { [key: string]: any },
) {
  return request<any>('/api/tender/getResultList', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
