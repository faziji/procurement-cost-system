import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { getPurchaseAnnouncementList, deletePurchaseAnnouncements } from '@/services/resources/api'

// 文件预览
import ProDescriptions, { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';


const Apply: React.FC = () => {
    const [showDetail, setShowDetail] = useState<boolean>(false);

    const actionRef = useRef<ActionType>();
    const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
    const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

    const columns: ProColumns<API.RuleListItem>[] = [
        {
            title: "ID",
            dataIndex: 'id',
            valueType: 'textarea',
        },
        {
            title: "投标项目名称",
            dataIndex: 'name',
            tip: 'The file name is the unique key',
            render: (dom, entity) => {
                return (
                    <a
                        onClick={() => {
                            setCurrentRow(entity);
                            setShowDetail(true);
                        }}
                    >
                        {dom}
                    </a>
                );
            },
        },
        {
            title: "描述",
            dataIndex: 'description',
            valueType: 'textarea',
        },
        {
            title: "状态",
            dataIndex: 'status',
            hideInForm: true,
            valueEnum: {
                0: {
                    text: (
                        <FormattedMessage
                            id="pages.searchTable.nameStatus.default"
                            defaultMessage="Unpublished"
                        />
                    ),
                    status: 'Default',
                },
                1: {
                    text: (
                        <FormattedMessage id="pages.searchTable.nameStatus.running" defaultMessage="Running" />
                    ),
                    status: 'Processing',
                },
                2: {
                    text: (
                        <FormattedMessage id="pages.searchTable.nameStatus.finished" defaultMessage="Finished" />
                    ),
                    status: 'Error',
                },
                3: {
                    text: (
                        <FormattedMessage
                            id="pages.searchTable.nameStatus.abnormal"
                            defaultMessage="Abnormal"
                        />
                    ),
                    status: 'Error',
                },
            },
        },
        {
            title: "发布时间",
            dataIndex: 'publishTime',
            valueType: 'textarea',
        },
        {
            title: "生效时间",
            dataIndex: 'startTime',
            valueType: 'textarea',
        },
        {
            title: "结束时间",
            dataIndex: 'endTime',
            valueType: 'textarea',
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.RuleListItem, API.PageParams>
                headerTitle="查询投标项目（点击项目名称查看投标详情）"
                actionRef={actionRef}
                rowKey="id"
                search={{
                    labelWidth: 120,
                }}
                toolBarRender={() => [
                    <Button
                        type="primary"
                        key="primary"
                        disabled
                        onClick={() => {
                            // handleModalVisible(true);
                        }}
                    >
                        <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
                    </Button>,
                ]}
                request={getPurchaseAnnouncementList}
                columns={columns}
                rowSelection={{
                    onChange: (_, selectedRows) => {
                        setSelectedRows(selectedRows);
                    },
                }}
            />
            <Drawer
                width={600}
                visible={showDetail}
                onClose={() => {
                    setCurrentRow(undefined);
                    setShowDetail(false);
                }}
                closable={false}
            >
                {currentRow?.name && (
                    <ProDescriptions<API.RuleListItem>
                        column={2}
                        title={currentRow?.name}
                        request={async () => ({
                            data: currentRow || {},
                        })}
                        params={{
                            id: currentRow?.name,
                        }}
                        columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
                    />
                )}
            </Drawer>
        </PageContainer>
    );
};

export default Apply;
