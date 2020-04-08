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
            <li>请使用<em>大陆ip访问</em>, 部分歌曲受地区保护</li>
          </ol>
          <div class="nec-main-footer">
            <p><a href="https://2020.tomluvjerry.cn"><img alt="我的主页" src="../assets/lhyUnited-brightgreen.svg"></a>
              <a href="https://github.com/lhyUnited/NetEaseCloudMusic/stargazers"><img height="20" alt="GitHub stars" src="../assets/NetEaseCloudMusic.svg"></a>
            </p>
          </div>
        </div>
      </el-main>
    </el-container>
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
    }
  }
}
</script>

<style scoped>

</style>
