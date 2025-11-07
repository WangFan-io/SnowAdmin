<template>
  <div>
    <div class="login_form_box">
      <div class="form-box">
        <t-form ref="formRef" :data="form" :rules="rules" :colon="true" :label-width="0" @submit="onSubmit">
          <t-form-item name="username">
            <t-input v-model="form.username" clearable placeholder="请输入账号：admin/common">
              <template #prefix-icon>
                <desktop-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="password">
            <t-input v-model="form.password" type="password" clearable placeholder="请输入密码">
              <template #prefix-icon>
                <lock-on-icon />
              </template>
            </t-input>
          </t-form-item>

          <t-form-item name="verifyCode">
            <div class="verifyCode">
              <t-input style="width: 160px" v-model="form.verifyCode" clearable placeholder="请输入验证码" />
              <s-verify-code
                :content-height="30"
                :font-size-max="30"
                :content-width="110"
                @verify-code-change="verifyCodeChange"
              />
            </div>
          </t-form-item>

          <t-form-item name="remember">
            <div class="remember">
              <t-checkbox v-model="form.remember">记住密码</t-checkbox>
              <div class="forgot-password">忘记密码</div>
            </div>
          </t-form-item>

          <t-form-item>
            <t-button theme="primary" type="submit" block>登录</t-button>
          </t-form-item>
        </t-form>
      </div>
    </div>
    <div class="register">注册账号</div>
  </div>
</template>

<script setup lang="ts">
import { loginAPI } from "@/api/modules/user/index";
import { useRouter } from "vue-router";
import { useSystemStore } from "@/store/modules/system";
import { useUserInfoStore } from "@/store/modules/user-info";
import { useRouteConfigStore } from "@/store/modules/route-config";
import { DesktopIcon, LockOnIcon } from "tdesign-icons-vue-next";
import { MessagePlugin } from "tdesign-vue-next";

let userStores = useUserInfoStore();
const routeStore = useRouteConfigStore();
const router = useRouter();
const formRef = ref();
const form = ref({
  username: "admin",
  password: "123456",
  verifyCode: "",
  remember: false
});
const rules = ref({
  username: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
  verifyCode: [
    {
      required: true,
      message: "请输入验证码"
    },
    {
      validator: (value: string): any => {
        if (value !== verifyCode.value) {
          return { result: false, message: "请输入正确的验证码", type: "error" };
        }
        return { result: true };
      }
    }
  ]
});
const verifyCode = ref("");
const verifyCodeChange = (code: string) => (verifyCode.value = code);

// 提交表单
const onSubmit = ({ validateResult, e }: any) => {
  e.preventDefault();
  if (validateResult === true) {
    onLogin();
  }
};

// 登录
const onLogin = async () => {
  // 登录
  let res = await loginAPI(form.value);
  // 存储token
  await userStores.setToken(res.data.token);
  // 加载用户信息
  await userStores.setAccount();
  // 加载路由信息
  await routeStore.initSetRouter();

  MessagePlugin.success("登录成功");
  // 跳转首页
  router.replace("/home");
  // 设置字典
  useSystemStore().setDictData();
};
</script>

<style lang="scss" scoped>
.login_form_box {
  margin-top: 28px;
  .form-box {
    width: 100%;
    margin-top: 40px;
  }
  .verifyCode {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .remember {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    .forgot-password {
      color: $color-primary;
      cursor: pointer;
    }
  }
}
.register {
  margin-top: 28px;
  font-size: $font-size-body-1;
  color: var(--td-gray-color-6);
  text-align: center;
  cursor: pointer;
}
</style>
