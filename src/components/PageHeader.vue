<template>
  <el-header>
    <div class="page-logo" title="回到首页">
      <router-link class="logo-link" :to="{path: '/'}"><h1>NeteaseCloudMusic</h1></router-link>
    </div>
    <div class="nec-search">
      <el-input prefix-icon="el-icon-search" @input="changeMainKeyWord"
                v-model="keyWord" placeholder="输入任意内容按回车键搜索" @keydown.enter.native="search">
      </el-input>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'PageHeader',
  props: ['mainKeyWord'],
  data () {
    return {
      keyWord: ''
    }
  },
  created () {
    if (this.$route.query.keyword !== undefined) {
      this.keyWord = this.$route.query.keyword
    }
  },
  watch: {
    $route: {
      handler () {
        this.keyWord = this.$route.query.keyword
      }
    },
    mainKeyWord: function () {
      this.keyWord = this.mainKeyWord
    }
  },
  methods: {
    search () {
      if (this.keyWord !== '') {
        this.$router.push('/search?keyword=' + this.keyWord)
          .then(() => {})
      }
    },
    changeMainKeyWord (val) {
      this.$emit('changeMainKeyWord', val)
    }
  }
}
</script>

<style scoped>

</style>
