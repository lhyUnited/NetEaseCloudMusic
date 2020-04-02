<template>
  <el-container>
    <page-header></page-header>
    <el-container>
      <el-main>
        <div class="nec-main">
          <div class="nec-main-title">
          <p>本站所有网易云api均由<el-link type="primary" href="https://github.com/Binaryify/NeteaseCloudMusicApi">Binaryify</el-link>提供</p>
          </div>
          <p>说明:</p>
          <ol>
            <li>由于实际调用的是网易云官方api，所以搜素结果与官网保持一致</li>
            <li>本站提供普通用户在线听歌和歌曲下载的功能<em>(vip歌曲受限)</em>，请勿将下载文件用于商业用途</li>
            <li>本站所有功能在<el-link type="primary" href="https://static.tomluvjerry.cn:3001/uploads/b847a7a57f8d99672e367de2d78dec17.exe">chrome</el-link>, <el-link type="primary" href="https://static.tomluvjerry.cn:3001/uploads/635a6b13d17d6aed0269f09faf92a254.exe">firefox</el-link>和<el-link type="primary" href="https://static.tomluvjerry.cn:3001/uploads/b847a7a57f8d99672e367de2d78dec17.exe">搜狗高速浏览器</el-link>上测试通过</li>
            <li>iOS设备存在无法调节音量问题</li>
          </ol>
          <div class="nec-main-footer">
            <p><a href="https://2020.tomluvjerry.cn"><img alt="我的主页" src="https://img.shields.io/badge/lhyUnited-brightgreen"></a>
              <a href="https://github.com/lhyUnited/NetEaseCloudMusic/stargazers"><img height="20px" alt="GitHub stars" src="https://img.shields.io/github/stars/lhyUnited/NetEaseCloudMusic?style=plastic"></a>
            </p>
          </div>
        </div>
      </el-main>
    </el-container>
    <AudioPlayer :songInfo="songInfo"></AudioPlayer>
    <el-footer>
    </el-footer>
  </el-container>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
import PageHeader from '@/components/PageHeader'
export default {
  name: 'HomePage',
  components: {PageHeader, AudioPlayer},
  data () {
    return {
      results: '',
      songs: [],
      clicked: false,
      offset: 1,
      total: 0,
      limit: 10,
      songInfo: {
        name: '',
        id: 0,
        url: '',
        artists: []
      }
    }
  },
  methods: {
    initialList () {
      this.axios.get('/search?keywords=' + this.searchModel.keyWord + '&limit=' + this.limit +
        '&offset=' + (this.offset - 1) + '&type=1')
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res)
            this.songs = res.data.result.songs
            this.total = res.data.result.songCount
          }
        })
    },
    handleCurrentChange (val) {
      console.log(val)
      this.offset = val
      this.initialList()
    },
    handleSizeChange (val) {
      this.limit = val
      this.initialList()
    },
    search () {
      this.initialList()
    },
    getUrl (id, row) {
      this.axios.get('/song/url?id=' + id)
        .then((res) => {
          if (res.data.code === 200) {
            console.log(res)
            this.songInfo.id = id
            this.songInfo.url = res.data.data[0].url
            this.songInfo.name = row.name
            this.songInfo.artists = row.artists
            this.clicked = true
          }
        })
        .catch((err) => {
          console.log(err)
          this.$message.error('网络出错啦')
        })
    },
    onPause () {
      console.log('paused')
    }
  }
}
</script>

<style scoped>

</style>
