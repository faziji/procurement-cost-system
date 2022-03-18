export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },

  // 个人中心
  {
    path: '/account',
    name: 'account',
    icon: 'crown',
    // component: './TestPage',
    routes: [
      {
        path: '/account/center',
        name: 'center',
        icon: 'smile',
        component: './account/center',
      },
      {
        path: '/account/settings',
        name: 'settings',
        icon: 'smile',
        component: './account/settings',
      },
      {
        component: './404',
      },
    ],
  },
  // {
  //   name: 'list.table-list',
  //   icon: 'table',
  //   path: '/list',
  //   component: './TableList',
  // },
  {
    path: '/system',
    icon: 'SettingOutlined',
    name: '系统管理',
    // component: './System',
    routes: [
      {
        path: '/system/consultation',
        name: '征询意见',
        icon: 'smile',
        component: './system/Consultation',
      },
      {
        path: '/system/purchase-announcement',
        name: '采购公告',
        icon: 'smile',
        component: './system/PurchaseAnnouncement',
      },
      {
        path: '/system/result-announcement',
        name: '结果公告',
        icon: 'smile',
        component: './system/ResultAnnouncement',
      },
      {
        path: '/system/correct-announcement',
        name: '更正公告',
        icon: 'smile',
        component: './system/CorrectAnnouncement',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/Tender',
    icon: 'AimOutlined',
    name: '招投标管理',
    routes: [
      {
        path: '/Tender/apply',
        name: '投标管理',
        component: './Tender/Apply',
      },
      {
        path: '/Tender/result',
        name: '成交结果',
        component: './Tender/Result',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/Financial',
    icon: 'MoneyCollectOutlined',
    name: '财务管理',
    routes: [
      {
        path: '/Financial/contract',
        name: '合同管理',
        component: './Financial/Contract',
      },
      {
        path: '/Financial/invoice',
        name: '发票管理',
        component: './Financial/Invoice',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/Users',
    icon: 'UserOutlined',
    name: '用户管理',
    // component: './TestPage',
    routes: [
      {
        path: '/Users/supplier',
        name: '供应商管理',
        component: './Users/Supplier',
      },
      {
        path: '/Users/hr',
        name: '企业人事管理',
        component: './Users/Hr',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
