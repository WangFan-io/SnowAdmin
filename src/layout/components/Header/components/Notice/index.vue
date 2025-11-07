<template>
  <t-tabs :default-value="current" @change="onTab">
    <t-tab-panel v-for="item in noticeData" :key="item.id" :value="item.id">
      <template #label>{{ `${$t(`system.${item.title}`)}(${item.data.length})` }}</template>
      <div class="notice" v-for="content in item.data" :key="content.id">
        <t-image fit="cover" :src="myImage" :style="{ width: '36px', height: '36px' }" class="notice_img" />
        <div class="content margin-left">
          <div>
            <span class="nickname">{{ content.nickname }}</span>
            <span class="time margin-left">{{ content.time }}</span>
          </div>
          <div class="context">{{ content.content }}</div>
        </div>
      </div>
      <div class="notice-empty" v-if="item.data.length === 0">
        <t-empty />
      </div>
    </t-tab-panel>
  </t-tabs>
</template>

<script setup lang="ts">
import myImage from "@/assets/img/my-image.jpg";
const data = ref([
  { id: 100, img: "", time: "1分钟前", nickname: "兔子先森", content: "一键三连" },
  { id: 120, img: "", time: "1小时前", nickname: "捷克大力士", content: "与你握手问好" },
  { id: 130, img: "", time: "2小时前", nickname: "forever", content: "you forever" }
]);
const noticeData = ref([
  {
    id: 1,
    title: "notice",
    data: data.value
  },
  { id: 2, title: "message", data: [] },
  { id: 3, title: "backlog", data: [] }
]);
const current = ref<number>(1);
const onTab = (key: any) => {
  current.value = key;
};
</script>

<style lang="scss" scoped>
.notice {
  display: flex;
  align-items: center;
  width: 244px;
  margin: 16px;
  .notice_img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .content {
    width: 200px;
    .nickname {
      font-size: $font-size-body-3;
      color: $color-text-2;
    }
    .time {
      font-size: $font-size-body-1;
      color: $color-text-3;
    }
    .context {
      font-size: $font-size-body-3;
    }
  }
}
.notice-empty {
  width: 244px;
  margin: 16px;
}
.margin-left {
  margin-left: $margin-text;
}
</style>
