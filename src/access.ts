/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: any }) {
  const { currentUser } = initialState || {};
  console.log('111111111111111111111', currentUser);

  return {
    // canAdmin: currentUser && currentUser.access === 'admin',
    canAdmin: currentUser,
    canAdmin1: false,
    procurementRole: currentUser && currentUser.role === 'procurement',
    hrRole: currentUser && currentUser.role === 'hr',
    financialRole: currentUser && currentUser.role === 'financial',
    // 采购部门或财务部门
    procurementOrFinancialRole:
      currentUser && (currentUser.role === 'procurement' || currentUser.role === 'financial'),
    // 人事部门或采购部门：用户管理（人事=>企业人事，采购=>供应商）
    hrOrprocurementRole:
      currentUser && (currentUser.role === 'hr' || currentUser.role === 'procurement'),
  };
}
