// ---- plugin:feishu_multitable_crud_analysis_1 ----
// ============================================================
// 插件 feishu_multitable_crud_analysis_1 (飞书多维表格) 的类型定义
// 由 get_plugin_ai_json 自动生成
// ============================================================

export type FeishuMultitableCrudAnalysisOneBatchaddrecordsInput = {
  records: {
    record: {
      '项目名称'?: unknown;
      '项目负责人'?: number[];
      '项目总成本（元）'?: number;
      '项目已付成本（元）'?: number;
      '客户名称'?: string;
      '项目状态'?: string;
      '所属区域'?: string;
      '项目总金额（元）'?: number;
      '预计回款时间'?: number;
      '财务洞察'?: unknown;
    };
  }[];
};

/**
 * const input: FeishuMultitableCrudAnalysisOneBatchaddrecordsInput = { records };
 * capabilityClient.load('feishu_multitable_crud_analysis_1').call<FeishuMultitableCrudAnalysisOneBatchaddrecordsOutput>('batchAddRecords', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { records } = result;
 * 返回值形如：
 *   {"records":[{"id":"示例文本"}]}
 */
export type FeishuMultitableCrudAnalysisOneBatchaddrecordsOutput = {
  records: {
    id: string;
  }[];
};

export type FeishuMultitableCrudAnalysisOneBatchupdaterecordsInput = {
  records: {
    id: string;
    record: {
      '项目名称'?: unknown;
      '客户名称'?: string;
      '所属区域'?: string;
      '项目总金额（元）'?: number;
      '预计回款时间'?: number;
      '项目状态'?: string;
      '项目负责人'?: number[];
      '项目总成本（元）'?: number;
      '项目已付成本（元）'?: number;
      '财务洞察'?: unknown;
    };
  }[];
};

/**
 * const input: FeishuMultitableCrudAnalysisOneBatchupdaterecordsInput = { records };
 * capabilityClient.load('feishu_multitable_crud_analysis_1').call<FeishuMultitableCrudAnalysisOneBatchupdaterecordsOutput>('batchUpdateRecords', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { records } = result;
 * 返回值形如：
 *   {"records":[{"id":"示例文本"}]}
 */
export type FeishuMultitableCrudAnalysisOneBatchupdaterecordsOutput = {
  records: {
    id: string;
  }[];
};

export type FeishuMultitableCrudAnalysisOneDeleterecordsInput = {
  recordIDs: string[];
};

/**
 * const input: FeishuMultitableCrudAnalysisOneDeleterecordsInput = { recordIDs };
 * capabilityClient.load('feishu_multitable_crud_analysis_1').call<FeishuMultitableCrudAnalysisOneDeleterecordsOutput>('deleteRecords', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { success } = result;
 * 返回值形如：
 *   {"success":false}
 */
export type FeishuMultitableCrudAnalysisOneDeleterecordsOutput = {
  success: boolean;
};

export type FeishuMultitableCrudAnalysisOneSearchrecordsInput = {
  filter?: {
    conjunction?: string;
    conditions?: {
      operator: string;
      value?: string[];
      fieldName: string;
    }[];
  };
  textFormat?: string;
  pageToken?: string;
  pageSize?: number;
  fieldNames?: string[];
  sort?: {
    fieldName: string;
    desc?: boolean;
  }[];
};

/**
 * const input: FeishuMultitableCrudAnalysisOneSearchrecordsInput = { filter, textFormat, pageToken, ... };
 * capabilityClient.load('feishu_multitable_crud_analysis_1').call<FeishuMultitableCrudAnalysisOneSearchrecordsOutput>('searchRecords', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { hasMore, pageToken, total, ... } = result;
 * 返回值形如：
 *   {"hasMore":false,"pageToken":"示例文本","total":0,"records":[{"id":"示例文本","record":{"客户名称":"示例文本","所属区域":"示例文本","业务负责人":[],"项目总成本（元）":0,"项目已付成本（元）":0,"项目利润（元）":null,"预计回款时间":0,"项目名称":{},"项目负责人":[],"项目总金额（元）":0,"财务洞察":null,"最后更新时间":0,"项目状态":"示例文本","项目剩余应回款（元）":{},"项目应付成本（元）":null}}]}
 */
export type FeishuMultitableCrudAnalysisOneSearchrecordsOutput = {
  hasMore: boolean;
  pageToken?: string;
  total?: number;
  records: {
    id: string;
    record: {
      '客户名称'?: string;
      '所属区域'?: string;
      '业务负责人'?: number[];
      '项目总成本（元）'?: number;
      '项目已付成本（元）'?: number;
      '项目利润（元）'?: unknown;
      '预计回款时间'?: number;
      '项目名称'?: {
        text: string;
        originalValue?: {
          text: string;
          link?: string;
          mentionType?: unknown;
          token?: string;
          type: string;
        }[];
      };
      '项目负责人'?: number[];
      '项目总金额（元）'?: number;
      '财务洞察'?: unknown;
      '最后更新时间'?: number;
      '项目状态'?: string;
      '项目剩余应回款（元）'?: {
        bizType: string;
        value?: unknown;
      };
      '项目应付成本（元）'?: unknown;
    };
  }[];
};
// ---- end:feishu_multitable_crud_analysis_1 ----