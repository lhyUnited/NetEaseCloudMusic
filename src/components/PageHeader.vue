<template>
  <el-header>
    <div class="page-logo">
      <h1>NetEaseCloudMusic</h1>
    </div>
    <div class="nec-search">
      <el-input prefix-icon="el-icon-search" v-model="keyWord" placeholder="输入任意关键字来搜索" @keydown.enter.native="search">
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
