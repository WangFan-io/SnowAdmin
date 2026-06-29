<template>
  <div class="snow-fill">
    <div class="snow-fill-inner container">
      <div class="left-box">
        <t-input placeholder="请输入部门名称">
          <template #prefixIcon>
            <search-icon :style="{ cursor: 'pointer' }" />
          </template>
        </t-input>
        <div class="tree-box">
          <t-tree activable hover transition expandAll :line="true" :data="treeData" :keys="fieldNames" @active="onSelectTree" />
        </div>
      </div>
      <div class="right-box">
        <t-space :breakLine="true">
          <t-input v-model="form.name" placeholder="请输入用户名称" clearable style="width: 220px" />
          <t-input v-model="form.phone" placeholder="请输入手机号码" clearable style="width: 220px" />
          <t-select v-model="form.status" placeholder="用户状态" clearable style="width: 120px" :auto-width="false">
            <t-option v-for="item in openState" :key="item.value" :value="item.value" :label="item.name"></t-option>
          </t-select>
          <t-date-range-picker v-model="form.createTime" enable-time-picker format="YYYY-MM-DD HH:mm" clearable />
          <t-button theme="primary" @click="search">
            <template #icon><icon-search /></template>
            <span>查询</span>
          </t-button>
          <t-button theme="default" @click="reset">
            <template #icon><icon-refresh /></template>
            <span>重置</span>
          </t-button>
        </t-space>

        <t-row>
          <t-space :breakLine="true">
            <t-button theme="primary" @click="onAdd">
              <template #icon><icon-plus /></template>
              <span>新增</span>
            </t-button>
            <t-button theme="danger" @click="onBatchDelete">
              <template #icon><icon-delete /></template>
              <span>删除</span>
            </t-button>
          </t-space>
        </t-row>

        <t-table
          row-key="id"
          :data="accountList"
          :bordered="true"
          :loading="loading"
          :max-height="'100%'"
          :pagination="pagination"
          :selected-row-keys="selectedKeys"
          :columns="columns"
          @select-change="onSelectChange"
        >
          <template #sexCell="{ row }">
            <t-tag theme="primary" variant="light" v-if="row.sex == 1">男</t-tag>
            <t-tag theme="danger" variant="light" v-else-if="row.sex == 0">女</t-tag>
            <t-tag variant="light" v-else>未知</t-tag>
          </template>
          <template #statusCell="{ row }">
            <t-tag theme="primary" variant="light" v-if="row.status === 1">启用</t-tag>
            <t-tag theme="danger" variant="light" v-else>禁用</t-tag>
          </template>
          <template #operationCell="{ row }">
            <t-space>
              <t-button theme="primary" size="small" @click="onUpdate(row)">
                <template #icon><icon-edit /></template>
                <span>修改</span>
              </t-button>
              <t-popconfirm content="确定删除该账号吗?" theme="warning">
                <t-button theme="danger" size="small" :disabled="row.admin">
                  <template #icon><icon-delete /></template>
                  <span>删除</span>
                </t-button>
              </t-popconfirm>
              <t-tooltip content="用户详情">
                <t-button theme="success" size="small" @click="onDetail(row)">
                  <template #icon>
                    <icon-more />
                  </template>
                </t-button>
              </t-tooltip>
            </t-space>
          </template>
        </t-table>
      </div>
    </div>

    <t-dialog width="40%" v-model:visible="open" :header="title" class="account-dialog" @close="afterClose" @confirm="handleOk">
      <t-form ref="formRef" label-align="right" :rules="rules" :data="addFrom">
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item name="userName" label="用户名称">
              <t-input v-model="addFrom.userName" placeholder="请输入用户名称" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item name="nickName" label="昵称">
              <t-input v-model="addFrom.nickName" placeholder="请输入昵称" clearable />
            </t-form-item>
          </t-col>
        </t-row>
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item name="phone" label="手机号码">
              <t-input v-model="addFrom.phone" placeholder="请输入手机号码" clearable />
            </t-form-item>
          </t-col>
          <t-col :span="6">
            <t-form-item name="email" label="邮箱">
              <t-input v-model="addFrom.email" placeholder="请输入邮箱" clearable />
            </t-form-item>
          </t-col>
        </t-row>
        <t-row :gutter="16">
          <t-col :span="6">
            <t-form-item name="sex" label="性别">
              <t-radio-group v-model="addFrom.sex">
                <t-radio :value="1">男</t-radio>
                <t-radio :value="0">女</t-radio>
                <t-radio :value="2">未知</t-radio>
              </t-radio-group>
            </t-form-item>
          </t-col>
        </t-row>
        <t-form-item name="deptId" label="所属部门">
          <t-tree-select
            v-model="addFrom.deptId"
            :data="treeData"
            :tree-props="{
              keys: { value: 'id', label: 'name', children: 'children' }
            }"
            placeholder="请选择所属部门"
          ></t-tree-select>
        </t-form-item>
        <t-form-item name="roles" label="角色">
          <t-select v-model="addFrom.roles" multiple placeholder="请选择角色">
            <t-option
              v-for="item in roleList"
              :key="item.code"
              :value="item.code"
              :label="item.name"
              :disabled="item.admin"
            ></t-option>
          </t-select>
        </t-form-item>
        <t-form-item name="status" label="状态">
          <t-switch v-model="addFrom.status" :custom-value="[1, 0]">
            <template #label="slotProps">{{ slotProps.value === 1 ? "启用" : "禁用" }}</template>
          </t-switch>
        </t-form-item>
        <t-form-item name="description" label="描述">
          <t-textarea v-model="addFrom.description" placeholder="请输入描述" autosize />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script setup lang="tsx">
import { SearchIcon } from "tdesign-icons-vue-next";
import { getDivisionAPI, getAccountAPI, getRoleAPI } from "@/api/modules/system/index";
import { deepClone } from "@/utils";

const router = useRouter();
const openState = ref(dictFilter("status"));
const form = ref({
  name: "",
  phone: "",
  status: "",
  createTime: []
});
const search = () => {
  getAccount();
};
const reset = () => {
  form.value = {
    name: "",
    phone: "",
    status: "",
    createTime: []
  };
  getAccount();
};
// 新增
const open = ref(false);
const rules = {
  userName: [
    {
      required: true,
      message: "请输入用户名称"
    }
  ],
  nickName: [
    {
      required: true,
      message: "请输入昵称"
    }
  ],
  sex: [
    {
      required: true,
      message: "请选择性别"
    }
  ],
  deptId: [
    {
      required: true,
      message: "请选择所属部门"
    }
  ],
  roles: [
    {
      required: true,
      message: "请选择角色"
    }
  ],
  status: [
    {
      required: true,
      message: "请选择状态"
    }
  ]
};
const addFrom = ref<any>({
  userName: "",
  nickName: "",
  phone: "",
  email: "",
  sex: 2,
  deptId: null,
  roles: [],
  status: 1,
  description: ""
});
const formType = ref(0); // 0新增 1修改
const title = ref("");
const formRef = ref();
const onAdd = () => {
  title.value = "新增账号";
  formType.value = 0;
  open.value = true;
};
const handleOk = async () => {
  const result = await formRef.value.validate();
  if (result.validateResult !== true) return; // 校验不通过
  arcoMessage("success", "模拟提交成功");
  open.value = false;
  getAccount();
};
// 关闭对话框动画结束后触发
const afterClose = () => {
  formRef.value.reset();
  addFrom.value = {
    userName: "",
    nickName: "",
    phone: "",
    email: "",
    sex: 2,
    deptId: null,
    roles: [],
    status: 1,
    description: ""
  };
};
const onUpdate = (row: any) => {
  title.value = "修改账号";
  formType.value = 1;
  addFrom.value = deepClone(row);
  open.value = true;
};

const onDetail = (row: any) => {
  console.log(row);

  router.push({
    path: "/system/userinfo",
    query: {
      id: row.id,
      userName: row.userName
    }
  });
};

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
    checkProps: ({ row }: any) => ({ disabled: row.disabled === true })
  },
  {
    title: "序号",
    colKey: "index",
    width: 64,
    cell: (h: any, { rowIndex }: any) => {
      return h("span", rowIndex + 1);
    }
  },
  {
    title: "用户名称",
    colKey: "userName"
  },
  {
    title: "昵称",
    colKey: "nickName"
  },
  {
    title: "性别",
    colKey: "sex",
    align: "center" as const,
    cell: "sexCell"
  },
  {
    title: "部门",
    colKey: "deptName"
  },
  {
    title: "手机号",
    colKey: "phone",
    width: 180
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
    width: 200,
    align: "center" as const,
    fixed: "right" as const,
    cell: "operationCell"
  }
]);
// 账户
const accountList = ref();
const getAccount = async () => {
  loading.value = true;
  let res = await getAccountAPI();
  res.data.forEach((item: any) => item.admin && (item.disabled = true));
  accountList.value = res.data;
  pagination.value.total = res.data.length;
  loading.value = false;
};
const selectedKeys = ref<(string | number)[]>([]);
const onSelectChange = (keys: (string | number)[]) => {
  selectedKeys.value = keys;
};
const onBatchDelete = () => {
  const selectedData = accountList.value.filter((item: any) => selectedKeys.value.includes(item.id));
  console.log("勾选的数据:", selectedData);
};

// 部门树
const fieldNames = ref({
  value: "id",
  label: "name",
  children: "children"
});
const treeData = ref();
const getDivision = async () => {
  let res = await getDivisionAPI();
  treeData.value = res.data;
};

const onSelectTree = () => {
  getAccount();
};

// 角色列表
const roleList = ref<any>([]);
const getRole = async () => {
  let res = await getRoleAPI();
  roleList.value = res.data;
};

onMounted(() => {
  getDivision();
  getAccount();
  getRole();
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  column-gap: $padding;
  .left-box {
    display: flex;
    flex-direction: column;
    width: 250px;
    height: 100%;
    .tree-box {
      flex: 1;
      margin-top: $padding;
      overflow: auto;
    }
  }
  .right-box {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: $padding;
  }
}
</style>

<style lang="scss">
.account-dialog {
  .t-dialog__body {
    overflow-x: hidden;
  }
}
</style>
