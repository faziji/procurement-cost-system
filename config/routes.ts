/**
 * 权限管理
 * 0. 所有权限
 * 0.1 分析页
 * 0.2 欢迎
 * 0.3 个人页（个人中心、个人设置）
 * 0.4 系统管理（征询意见、采购公告、结果公告、更正公告）
 * 0.5 招投标管理（投标管理、成交结果）
 * 0.6 财务管理（合同管理、发票管理）
 * 0.7 用户管理（供应商管理、企业人事管理）
 *
 * 1. 采购部门
 * 1.1 分析页
 * 1.2 欢迎
 * 1.3 个人页（个人中心、个人设置）
 * 1.4 系统管理（征询意见、采购公告、结果公告、更正公告）
 * 1.5 招投标管理（投标管理、成交结果）
 * 1.7 用户管理（供应商管理）
 *
 * 2. 财务部门
 * 2.1 分页页
 * 2.2 欢迎页
 * 2.3 个人页（个人中心、个人设置）
 * 2.4 系统管理（采购公告）
 * 2.6 财务管理（合同管理、发票管理）
 *
 * 3. 人事部门
 * 3.1 分页页
 * 3.2 欢迎页
 * 3.3 个人页（个人中心、个人设置）
 * 3.7 用户管理（企业人事管理）
 *
 * 备注：开发的时候将access全部注释，实际完成之后需要全部放开
 */
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
    name: '分析页',
    icon: 'smile',
    path: '/welcome/dashboardanalysis',
    component: './StatisticBasic/DashboardAnalysis',
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  // {
  //   path: '/admin',
  //   name: 'admin',
  //   icon: 'crown',
  //   access: 'canAdmin',
  //   component: './Admin',
  //   routes: [
  //     {
  //       path: '/admin/sub-page',
  //       name: 'sub-page',
  //       icon: 'smile',
  //       component: './Welcome',
  //     },
  //     {
  //       component: './404',
  //     },
  //   ],
  // },
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
  {
    path: '/system',
    icon: 'SettingOutlined',
    name: '系统管理',
    // access: 'procurementOrFinancialRole',
    routes: [
      {
        path: '/system/consultation',
        name: '征询意见',
        icon: 'smile',
        // access: 'procurementRole',
        component: './system/Consultation',
      },
      {
        path: '/system/purchase-announcement',
        name: '采购公告',
        icon: 'smile',
        // access: 'procurementOrFinancialRole',
        component: './system/PurchaseAnnouncement',
      },
      {
        path: '/system/result-announcement',
        name: '结果公告',
        icon: 'smile',
        // access: 'procurementRole',
        component: './system/ResultAnnouncement',
      },
      {
        path: '/system/correct-announcement',
        name: '更正公告',
        icon: 'smile',
        // access: 'procurementRole',
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
    // access: 'procurementOrFinancialRole',
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
    // access: 'financialRole',
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
    // access: 'hrOrprocurementRole',
    // component: './TestPage',
    routes: [
      {
        path: '/Users/supplier',
        name: '供应商管理',
        component: './Users/Supplier',
        // access: 'procurementRole',
      },
      {
        path: '/Users/hr',
        name: '企业人事管理',
        component: './Users/Hr',
        // access: 'hrRole',
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
