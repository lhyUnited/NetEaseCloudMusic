<template>
  <el-header>
    <div class="page-logo" title="回到首页">
      <router-link class="logo-link" :to="{path: '/'}"><h1>NetEaseCloudMusic</h1></router-link>
    </div>
    <div class="nec-search">
      <el-input prefix-icon="el-icon-search" v-model="keyWord" placeholder="输入任意内容按回车键搜索" @keydown.enter.native="search">
      </el-input>
    </div>
  </el-header>
</template>

<script>
export default {
  name: 'PageHeader',
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
    }
  },
  methods: {
    search () {
      if (this.keyWord !== '') {
        this.$router.push('/search?keyword=' + this.keyWord)
          .then(() => {})
      }
    }
  }
}
</script>

<style scoped>

</style>
