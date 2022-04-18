import moment from 'moment';
import type { Request, Response } from 'express';
import type { AnalysisData, RadarData, DataItem } from './data.d';

// mock data
const visitData: DataItem[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const visitData2 = [];
const fakeY2 = [1, 6, 4, 8, 3, 7, 2];
for (let i = 0; i < fakeY2.length; i += 1) {
  visitData2.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY2[i],
  });
}

const salesData = [];
for (let i = 0; i < 4; i += 1) {
  salesData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 10) + 25,
  });
}

function random(min: any, max: any) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// 关键词
const keysValue = [
  '结果公告',
  '采购公告',
  '更正公告',
  '征询意见',
  '招投标',
  '投标',
  '招标',
  '开标时间',
  '反馈',
  '后台',
  '模板',
  '下载',
  '政策',
  '部门概况',
  '办事指南',
  '党建工作',
  '联系我们',
  '旧版入口',
  '管理入口',
  '公告',
  '定向公示',
  '征求意见',
  '工作动态',
];
const searchData = [];
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: keysValue[Math.floor(Math.random() * (22 - 0)) + 0],
    count: Math.floor(Math.random() * 10),
    range: Math.floor(Math.random() * 10),
    status: Math.floor((Math.random() * 10) % 2),
  });
}
const salesTypeData = [
  {
    x: '部门概况',
    y: 9,
  },
  {
    x: '政策法规',
    y: 8,
  },
  {
    x: '办事指南',
    y: 4,
  },
  {
    x: '下载中心',
    y: 5,
  },
  {
    x: '其他',
    y: 15,
  },
  {
    x: '征询意见',
    y: 12,
  },
  {
    x: '采购公告',
    y: 1,
  },
  {
    x: '更正公告',
    y: 14,
  },
  {
    x: '结果公告',
    y: 18,
  },
  {
    x: '日历搜索',
    y: 14,
  },
  {
    x: '其他',
    y: 15,
  },
];

const salesTypeDataOnline = [
  {
    x: '征询意见',
    y: 2,
  },
  {
    x: '采购公告',
    y: 1,
  },
  {
    x: '更正公告',
    y: 14,
  },
  {
    x: '结果公告',
    y: 18,
  },
  {
    x: '日历搜索',
    y: 14,
  },
  {
    x: '其他',
    y: 15,
  },
];

const salesTypeDataOffline = [
  {
    x: '部门概况',
    y: 9,
  },
  {
    x: '政策法规',
    y: 8,
  },
  {
    x: '办事指南',
    y: 4,
  },
  {
    x: '下载中心',
    y: 5,
  },
  {
    x: '其他',
    y: 15,
  },
];

const offlineData = [];
for (let i = 0; i < 10; i += 1) {
  offlineData.push({
    name: `Stores ${i}`,
    cvr: Math.ceil(Math.random() * 9) / 10,
  });
}
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  const date = moment(new Date().getTime() + 1000 * 60 * 30 * i).format('HH:mm');
  offlineChartData.push({
    date,
    type: '客流量',
    value: Math.floor(Math.random() * 100) + 10,
  });
  offlineChartData.push({
    date,
    type: '支付笔数',
    value: Math.floor(Math.random() * 100) + 10,
  });
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7,
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1,
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7,
  },
];

const radarData: RadarData[] = [];
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度',
};
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key],
      });
    }
  });
});

const getFakeChartData: AnalysisData = {
  visitData,
  visitData2,
  salesData,
  searchData,
  offlineData,
  offlineChartData,
  salesTypeData,
  salesTypeDataOnline,
  salesTypeDataOffline,
  radarData,
};

const fakeChartData = (_: Request, res: Response) => {
  return res.json({
    data: getFakeChartData,
  });
};

export default {
  'GET  /api/fake_analysis_chart_data': fakeChartData,
};
