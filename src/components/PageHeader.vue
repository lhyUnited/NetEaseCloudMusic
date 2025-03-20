<template>
  <el-header>
    <div
      class="page-logo"
      title="回到首页"
    >
      <router-link
        class="logo-link"
        :to="{ path: '/' }"
      >
        <h1>NeteaseCloudMusic</h1>
      </router-link>
    </div>
    <div class="nec-search">
      <el-input
        v-model="keyWord"
        :prefix-icon="ElIconSearch"
        placeholder="输入任意内容按回车键搜索"
        @input="changeMainKeyWord"
        @keydown.enter="search"
      />
    </div>
  </el-header>
</template>

<script>
import { Search as ElIconSearch } from '@element-plus/icons-vue'
import { shallowRef } from "vue";

export default {
  name: 'PageHeader',
  props: {
    mainKeyWord: {
      type: String,
      default: ''
    }
  },
  emits: ['changeMainKeyWord'],
  data() {
    return {
      keyWord: '',
      ElIconSearch: shallowRef(ElIconSearch),
    }
  },
  watch: {
    $route: {
      handler() {
        this.keyWord = this.$route.query.keyword
      },
    },
    mainKeyWord: function () {
      this.keyWord = this.mainKeyWord
    },
  },
  created() {
    if (this.$route.query.keyword !== undefined) {
      this.keyWord = this.$route.query.keyword
    }
  },
  methods: {
    search() {
      if (this.keyWord !== '') {
        this.$router.push('/search?keyword=' + this.keyWord)
        // .then(() => {})
      }
    },
    changeMainKeyWord(val) {
      this.$emit('changeMainKeyWord', val)
    },
  },
}
</script>

<style scoped></style>
