<template>
  <div class="snow-page">
    <div class="snow-inner">
      <s-layout-tools>
        <template #left>
          <t-space wrap>
            <t-input style="width: 220px" v-model="form.name" placeholder="请输入角色名称" clearable />
            <t-input style="width: 220px" v-model="form.code" placeholder="请输入角色标识" clearable />
            <t-select style="width: 120px" v-model="form.status" placeholder="角色状态" clearable :auto-width="false">
              <t-option v-for="item in openState" :key="item.value" :value="item.value" :label="item.name"></t-option>
            </t-select>
            <t-date-range-picker v-model="form.time" enable-time-picker format="YYYY-MM-DD HH:mm" clearable />
            <t-button theme="primary" @click="search">
              <template #icon><icon-search /></template>
              <span>查询</span>
            </t-button>
            <t-button theme="default" @click="reset">
              <template #icon><icon-refresh /></template>
              <span>重置</span>
            </t-button>
          </t-space>
        </template>
        <template #right>
          <t-space wrap>
            <t-button theme="primary" @click="onAdd">
              <template #icon><icon-plus /></template>
              <span>新增</span>
            </t-button>
            <t-button theme="danger">
              <template #icon><icon-delete /></template>
              <span>删除</span>
            </t-button>
          </t-space>
        </template>
      </s-layout-tools>
      <t-table
        style="margin-top: 16px"
        row-key="id"
        :data="roleList"
        :bordered="true"
        :loading="loading"
        :max-height="'100%'"
        :pagination="pagination"
        :selected-row-keys="selectedKeys"
        :columns="columns"
        @select-change="onSelectChange"
      >
        <template #indexCell="{ rowIndex }">
          {{ rowIndex + 1 }}
        </template>
        <template #statusCell="{ row }">
          <t-tag theme="primary" variant="light" v-if="row.status === 1">启用</t-tag>
          <t-tag theme="danger" variant="light" v-else>禁用</t-tag>
        </template>
        <template #operationCell="{ row }">
          <t-space>
            <t-button theme="success" size="small" :disabled="row.admin" @click="onPrivileges(row)">
              <template #icon><icon-safe /></template>
              <span>分配权限</span>
            </t-button>
            <t-button theme="primary" size="small" :disabled="row.admin" @click="onUpdate(row)">
              <template #icon><icon-edit /></template>
              <span>修改</span>
            </t-button>
            <t-popconfirm content="确定删除该角色吗?" theme="warning">
              <t-button theme="danger" size="small" :disabled="row.admin">
                <template #icon><icon-delete /></template>
                <span>删除</span>
              </t-button>
            </t-popconfirm>
          </t-space>
        </template>
      </t-table>
    </div>
    <t-dialog width="40%" v-model:visible="open" :header="title" @close="afterClose" @confirm="handleOk">
      <t-form ref="formRef" label-align="right" :rules="rules" :data="addFrom">
        <t-form-item name="name" label="角色名称">
          <t-input v-model="addFrom.name" placeholder="请输入角色名称" clearable />
        </t-form-item>
        <t-form-item name="code" label="角色编码">
          <t-input v-model="addFrom.code" placeholder="请输入角色编码" clearable />
        </t-form-item>
        <t-form-item name="status" label="状态">
          <t-switch v-model="addFrom.status" :custom-value="[1, 0]">
            <template #label="slotProps">{{ slotProps.value === 1 ? "启用" : "禁用" }}</template>
          </t-switch>
        </t-form-item>
        <t-form-item name="sort" label="排序">
          <t-input-number
            v-model="addFrom.sort"
            :step="1"
            :min="1"
            :max="9999"
            :style="{ width: '150px' }"
            placeholder="请输入"
          />
        </t-form-item>
        <t-form-item name="description" label="描述">
          <t-textarea v-model="addFrom.description" placeholder="请输入描述" autosize />
        </t-form-item>
      </t-form>
    </t-dialog>

    <t-drawer :visible="drawerOpen" size="500px" :header="'分配权限'" @confirm="drawerOk" @close="drawerCancel">
      <div>
        <t-card>
          <t-row :gutter="24" justify="center">
            <t-col :span="4">
              <span class="text-right-gap">展开全部</span>
              <t-switch v-model="treeSwitch.expandAll" @change="onExpandAll">
                <template #label="slotProps">{{ slotProps.value ? "是" : "否" }}</template>
              </t-switch>
            </t-col>
            <t-col :span="4">
              <span class="text-right-gap">全选节点</span>
              <t-switch v-model="treeSwitch.selectAll" @change="onSelectAll">
                <template #label="slotProps">{{ slotProps.value ? "是" : "否" }}</template>
              </t-switch>
            </t-col>
            <t-col :span="4">
              <span class="text-right-gap">父子关联</span>
              <t-tooltip
                content="权限树的父子节点独立，因为若节点关联，父节点会存在半选情况，半选节点的ID不会返回，会导致菜单无法渲染"
                :overlay-style="{ width: '200px' }"
                placement="bottom"
                show-arrow
              >
                <icon-question-circle />
              </t-tooltip>
            </t-col>
          </t-row>
        </t-card>

        <t-tree
          :keys="{
            value: 'id',
            label: 'i18n',
            children: 'children'
          }"
          :check-strictly="!treeSwitch.checkStrictly"
          :checkable="true"
          :line="true"
          :expand-all="treeSwitch.expandAll"
          v-model:value="permissionKeys"
          v-model:expanded="expandedKeys"
          :data="permissionTree"
        />
      </div>
    </t-drawer>
  </div>
</template>

<script setup lang="ts">
import { getRoleAPI, getMenuListAPI, getUserPermissionAPI } from "@/api/modules/system/index";
import { deepClone } from "@/utils";
import useGlobalProperties from "@/hooks/useGlobalProperties";
const proxy = useGlobalProperties();
const openState = ref(dictFilter("status"));
const form = ref({
  name: "",
  code: "",
  time: [],
  status: 1
});
const search = () => {
  getRole();
};
const reset = () => {
  form.value = {
    name: "",
    code: "",
    time: [],
    status: 1
  };
  getRole();
};

// 新增
const open = ref(false);
const rules = {
  name: [{ required: true, message: "请输入角色名称" }],
  code: [{ required: true, message: "请输入角色编码" }],
  status: [{ required: true, message: "请选择状态" }]
};
const addFrom = ref<any>({
  name: "",
  code: "",
  status: 1,
  sort: 1,
  description: ""
});

const title = ref("");
const formRef = ref();
const onAdd = () => {
  title.value = "新增角色";
  open.value = true;
};
const handleOk = async () => {
  let result = await formRef.value.validate();
  if (result.validateResult !== true) return (open.value = true); // 校验不通过
  arcoMessage("success", "模拟提交成功");
  getRole();
};
// 关闭对话框动画结束后触发
const afterClose = () => {
  formRef.value.reset();
  addFrom.value = {
    name: "",
    code: "",
    status: 1,
    sort: 1,
    description: ""
  };
};
// 修改角色
const onUpdate = (row: any) => {
  title.value = "修改角色";
  addFrom.value = deepClone(row);
  open.value = true;
};

// 获取列表
const loading = ref(false);
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
  showPageSize: true
});
const columns: any = ref([
  {
    colKey: "selection",
    type: "multiple" as const,
    width: 50,
    checkProps: ({ row }: any) => ({ disabled: row.admin === true })
  },
  {
    title: "序号",
    colKey: "index",
    width: 64,
    cell: "indexCell"
  },
  {
    title: "角色名称",
    colKey: "name"
  },
  {
    title: "角色标识",
    colKey: "code"
  },
  {
    title: "排序",
    colKey: "sort",
    width: 100,
    align: "center" as const
  },
  {
    title: "状态",
    colKey: "status",
    width: 100,
    align: "center" as const,
    cell: "statusCell"
  },
  {
    title: "描述",
    colKey: "description",
    ellipsis: true
  },
  {
    title: "创建时间",
    colKey: "createTime",
    width: 180
  },
  {
    title: "操作",
    colKey: "operation",
    width: 280,
    align: "center" as const,
    fixed: "right" as const,
    cell: "operationCell"
  }
]);
const roleList = ref([]);
const getRole = async () => {
  try {
    loading.value = true;
    let res = await getRoleAPI();
    res.data.forEach((item: any) => item.admin && (item.disabled = true));
    roleList.value = res.data;
    pagination.value.total = res.data.length;
  } finally {
    loading.value = false;
  }
};
const selectedKeys = ref<(string | number)[]>([]);
const onSelectChange = (keys: (string | number)[]) => {
  selectedKeys.value = keys;
};

// 获取权限树
const treeSwitch = ref({
  expandAll: true, // 展开全部
  selectAll: false, // 全选
  checkStrictly: false // 父子关联（默认关联）
});
const expandedKeys = ref<(string | number)[]>([]);

// 收集所有节点ID
const collectAllIds = (data: any[]): (string | number)[] => {
  const ids: (string | number)[] = [];
  const traverse = (nodes: any[]) => {
    nodes.forEach(node => {
      ids.push(node.id);
      if (node.children && node.children.length) traverse(node.children);
    });
  };
  traverse(data);
  return ids;
};

// 展开全部
const onExpandAll = (state: string | number | boolean) => {
  if (state) {
    expandedKeys.value = collectAllIds(permissionTree.value);
  } else {
    expandedKeys.value = [];
  }
};
// 全选
const onSelectAll = (state: string | number | boolean) => {
  if (state) {
    permissionKeys.value = collectAllIds(permissionTree.value);
  } else {
    permissionKeys.value = [];
  }
};

// 重置节点操作开关
const treeSwitchReset = () => {
  treeSwitch.value = {
    expandAll: true,
    selectAll: false,
    checkStrictly: false
  };
  expandedKeys.value = [];
  permissionKeys.value = [];
};
const permissionTree = ref<any[]>([]);
const permissionKeys = ref<(string | number)[]>([]);
const getMenuList = async () => {
  let { data } = await getMenuListAPI();
  translation(data);
  permissionTree.value = data;
};

// 分配权限
const drawerOpen = ref(false);
const onPrivileges = async (row: any) => {
  let res = await getUserPermissionAPI({ role: row.code });
  permissionKeys.value = res.data;
  // 默认展开所有节点
  treeSwitch.value.expandAll = true;
  expandedKeys.value = collectAllIds(permissionTree.value);
  drawerOpen.value = true;
};

const drawerOk = () => {
  console.log(permissionKeys.value);
  drawerOpen.value = false;
  treeSwitchReset();
  arcoMessage("success", "模拟提交成功");
  getRole();
};
const drawerCancel = () => {
  drawerOpen.value = false;
  treeSwitchReset();
};

// 语言转化
const translation = (tree: any) => {
  tree.forEach((item: any) => {
    if (item.children) translation(item.children);
    if (item.meta.title) {
      item.i18n = proxy.$t(`menu.${item.meta.title}`);
    }
  });
};

getRole();
getMenuList();
</script>

<style lang="scss" scoped>
.text-right-gap {
  margin-right: $margin;
}
</style>
