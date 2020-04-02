<template>
  <el-row class="nec-player">
    <audio ref="audio" :src="this.url"
           preload
    @loadedmetadata="onLoadedmetadata"
    @timeupdate="onTimeupdate">
    </audio>
    <div class="nec-player-wrapper">
      <div class="nec-player-controls">
          <i @click="playBack" class="fas fa-backward fa-2x btn-back"></i>
          <i @click="playOrPause" class="btn-play" :class="{'fas fa-play fa-2x': !this.playing, 'fas fa-pause fa-2x': this.playing}"></i>
          <i @click="playForward" class="fas fa-forward fa-2x btn-next"></i>
      </div>
      <div class="nec-player-page">
        <a class="">
          <img alt="歌曲封面" :src="this.picUrl"/>
        </a>
      </div>
      <div class="nec-player-play">
        <div class="nec-player-words">
          <span>{{ songList[this.index] === undefined ? '' : songList[this.index].name }}</span>
          <span>&nbsp;&nbsp;</span>
          <span v-for="(item, Artindex) in (songList[index] === undefined ? '' : songList[index].artists)" :key="item.id">{{ item.name }}<span v-if="Artindex < songList[index].artists.length - 1">/</span></span>
        </div>
        <el-slider v-model="sliderTime"
                   @mousedown.native="dragDown"
                   @mouseup.native="dragUp"
                   :format-tooltip="formatProcessToolTip"
                   @change="changeCurrentTime"></el-slider>
      </div>
      <div class="nec-player-time">
        <span>{{ currentTime | initialSeconds}} | {{ totalTime | initialSeconds}}</span>
      </div>
      <div class="nec-player-volume btn-volume">
        <el-popover placement="top"
                    justify="center"
          width="150px"
          trigger="hover">
          <el-slider
            :show-tooltip="false"
            v-model="volume"
            @input="changeVolume"
          vertical
          height="100px"></el-slider>
          <span slot="reference"><i class="fas fa-volume-up fa-2x"></i></span>
        </el-popover>
      </div>
      <div class="nec-player-download">
        <el-link :underline="false" :disabled="disabled" :href="(this.songList[this.index].length === 0) ? '' : (this.baseUrl + this.songList[this.index].id + '.mp3')" target="_blank" download><i class="fas fa-download fa-2x btn-download"></i></el-link>
      </div>
      <div class="nec-player-list-btn btn-list">
        <i class="fas fa-list-ul fa-2x" @click="expandSongList"></i>
      </div>
    </div>
    <div v-if="expandList" class="nec-player-list">
      <div class="nec-player-list-banner">
        <span>播放清单</span>
        <i class="el-icon-close nec-player-list-close" @click="closeSongList"></i>
      </div>
      <div class="nec-player-list-wrapper">
        <div v-for="(item, activeId) in songList" :key="item.url" :class="{'nec-player-list-detail-wrapper': true, 'active-wrapper': index === activeId}">
          <div class="nec-player-list-detail">
            <span><i class="el-icon-video-play list-btn-play" @click="playFromList(activeId, item.id)"></i></span><span>{{ item.name }}</span>
            <el-divider direction="vertical"></el-divider><span v-for="(itemArtist, index) in item.artists" :key="itemArtist.id">{{ itemArtist.name }}<span v-if="index < item.artists.length - 1">/</span></span>
            <span><i class="el-icon-delete list-btn-delete" @click="removeSongs(activeId)"></i></span>
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
function formatTime (sec) {
  if (typeof sec === 'string' || typeof sec === 'number') {
    sec = parseInt(sec)
  }
  let minutes = Math.floor(sec / 60)
  sec = sec - minutes * 60
  return ('0' + minutes).slice(-2) + ':' + ('0' + sec).slice(-2)
}
export default {
  name: 'AudioPlayer',
  props: ['songInfo'],
  data () {
    return {
      playing: false,
      totalTime: 0,
      currentTime: 0,
      picUrl: 'http://s4.music.126.net/style/web2/img/default/default_album.jpg',
      sliderTime: 0,
      disabled: true,
      expandList: false,
      songList: [],
      continue: false,
      baseUrl: 'https://music.163.com/song/media/outer/url?id=',
      url: '',
      index: -1,
      volume: 100
    }
  },
  watch: {
    songInfo: {
      handler () {
        this.insertIntoSongList(JSON.parse(JSON.stringify(this.songInfo)))
        this.playFromList(this.index, this.songInfo.id)
      },
      deep: true
    }
  },
  created () {
    window.addEventListener('beforeunload', e => this.unload(e))
    this.initialSongList()
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', () => {})
  },
  filters: {
    initialSeconds (second = 0) {
      return formatTime(second)
    }
  },
  methods: {
    unload () {
      localStorage.setItem('songList', JSON.stringify(this.songList))
      localStorage.setItem('index', this.index)
    },
    initialSongList () {
      if (JSON.parse(localStorage.getItem('songList')) === null || JSON.parse(localStorage.getItem('songList') === null)) {
        localStorage.setItem('songList', JSON.stringify(this.songList))
        localStorage.setItem('index', this.index)
      }
      this.songList = JSON.parse(localStorage.getItem('songList'))
      this.index = parseInt(localStorage.getItem('index'))
      if (this.songList.length !== 0 && this.index > -1) {
        this.axios.get('/song/detail?ids=' + this.songList[this.index].id)
          .then((res) => {
            this.picUrl = res.data.songs[0].al.picUrl
            this.url = this.baseUrl + this.songList[this.index].id + '.mp3'
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('网络出错啦')
          })
      }
    },
    changeVolume () {
      this.$refs.audio.volume = this.volume / 100
    },
    insertIntoSongList (singleSong) {
      let index = this.songList.findIndex(x => x.id === singleSong.id)
      if (index > -1) {
        this.$message.info('已在播放列表里')
        this.index = index
      } else {
        this.songList.push(singleSong)
        this.$message.success('成功加入播放列表')
        this.index = this.songList.length - 1
      }
    },
    removeSongs (index) {
      if (this.songList.length === 1) {
        this.index = -1
        this.songList.splice(0, 1)
        this.url = ''
        this.totalTime = 0
        this.sliderTime = 0
        this.picUrl = 'http://s4.music.126.net/style/web2/img/default/default_album.jpg'
        this.pause()
      } else if (index === this.index) {
        if (index === this.songList.length - 1) {
          this.songList.splice(index, 1)
          let newId = (index + 1) % this.songList.length
          this.playFromList(newId, this.songList[newId].id)
          this.index = newId
        } else {
          this.songList.splice(index, 1)
          this.index = index
          this.playFromList(index, this.songList[index].id)
        }
      } else {
        let id = this.songList[this.index].id
        this.songList.splice(index, 1)
        this.index = this.songList.findIndex(x => x.id === id)
      }
    },
    playFromList (index, id) {
      this.pause()
      this.index = index
      this.url = this.baseUrl + id + '.mp3'
      this.axios.get('/song/detail?ids=' + id)
        .then((res) => {
          this.picUrl = res.data.songs[0].al.picUrl
        })
      this.play()
    },
    playForward () {
      let len = this.songList.length
      if (len > 0) {
        let id = this.songList[(this.index + 1) % len].id
        this.playFromList((this.index + 1) % len, id)
      }
    },
    playBack () {
      let len = this.songList.length
      if (len > 0) {
        let id = this.songList[Math.abs(this.index - 1) % len].id
        this.playFromList(Math.abs(this.index - 1) % len, id)
      }
    },
    expandSongList () {
      this.expandList = !this.expandList
    },
    closeSongList () {
      this.expandList = false
    },
    formatProcessToolTip (index = 0) {
      index = parseInt(this.totalTime / 100 * index)
      return formatTime(index)
    },
    changeCurrentTime (index) {
      this.$refs.audio.currentTime = Math.floor(index / 100 * this.totalTime)
    },
    onTimeupdate (res) {
      this.currentTime = res.target.currentTime
      this.sliderTime = Math.ceil(this.currentTime / this.totalTime * 100)
      if (parseInt(this.totalTime) !== 0 && parseInt(this.currentTime) === parseInt(this.totalTime)) {
        this.playForward()
      }
    },
    onLoadedmetadata (res) {
      this.disabled = false
      this.sliderTime = 0
      this.totalTime = parseInt(res.target.duration)
    },
    playOrPause () {
      if (this.$refs.audio.paused) {
        this.play()
      } else {
        this.pause()
      }
    },
    pause () {
      if (!this.$refs.audio.paused) {
        this.$refs.audio.pause()
        this.playing = false
      }
    },
    play () {
      if (this.$refs.audio.paused) {
        this.$nextTick(() => {
          this.$refs.audio.play()
          this.playing = true
        })
        // this.$refs.audio.play()
        //   .then(() => {
        //     this.$refs.audio.play()
        //     console.log('play')
        //     this.playing = true
        //   })
        //   .catch((err) => console.log(err))
      }
    },
    dragDown () {
      this.continue = this.playing === true
      this.pause()
    },
    dragUp () {
      if (this.continue) {
        this.play()
      } else {
        this.pause()
      }
    }
  }
}
</script>

<style scoped>

</style>
