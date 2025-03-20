<template>
  <el-row class="nec-player">
    <audio
      ref="audio"
      :src="url"
      preload
      @play="played"
      @pause="paused"
      @loadedmetadata="onLoadedmetadata"
      @canplay="onCanplay"
      @timeupdate="onTimeupdate"
    />
    <div class="nec-player-wrapper">
      <div class="nec-player-controls">
        <i
          role="button"
          class="fas fa-backward fa-2x btn-back"
          :class="{ canplay }"
          @click="playBack"
        />
        <i
          role="button"
          class="btn-play"
          :class="{
            'fas fa-play fa-2x': !playing,
            'fas fa-pause fa-2x': playing,
            canplay
          }"
          @click="playOrPause"
        />
        <i
          role="button"
          class="fas fa-forward fa-2x btn-next"
          :class="{ canplay }"
          @click="playForward"
        />
      </div>
      <div class="nec-player-page">
        <a class>
          <img
            alt="歌曲封面"
            :src="picUrl"
          >
        </a>
      </div>
      <div class="nec-player-play">
        <div class="nec-player-words">
          <span>{{
            songList[index] === undefined ? '' : songList[index].name
          }}</span>
          <span>&nbsp;&nbsp;</span>
          <span
            v-for="(item, ArtIndex) in songList[index] === undefined
              ? ''
              : songList[index].artists"
            :key="item.id"
          >
            {{ item.name }}<span v-if="ArtIndex < songList[index].artists.length - 1">/</span>
          </span>
        </div>
        <el-slider
          v-model="sliderTime"
          :format-tooltip="formatProcessToolTip"
          @mousedown="dragDown"
          @mouseup="dragUp"
          @change="changeCurrentTime"
        />
      </div>
      <div class="nec-player-time">
        <span>{{ initialSeconds(currentTime) }} |
          {{ initialSeconds(totalTime) }}</span>
      </div>
      <div class="nec-player-volume btn-volume">
        <el-popover
          placement="top"
          justify="center"
          width="150"
          trigger="hover"
        >
          <el-slider
            v-model="volume"
            :show-tooltip="false"
            vertical
            height="100px"
            @input="changeVolume"
          />
          <template #reference>
            <span>
              <i class="fas fa-volume-up fa-2x" />
            </span>
          </template>
        </el-popover>
      </div>
      <div class="nec-player-download">
        <el-link
          :underline="false"
          :disabled="disabled"
          :href="
            index <= -1
              ? ''
              : baseUrl + songList[index].id + '.mp3'
          "
          target="_blank"
          download
        >
          <i
            class="fas fa-download fa-2x btn-download"
            :class="{ disabled }"
          />
        </el-link>
      </div>
      <div class="nec-player-list-btn btn-list">
        <i
          class="fas fa-list-ul fa-2x"
          @click="expandSongList"
        />
      </div>
    </div>
    <div
      v-if="expandList"
      class="nec-player-list"
    >
      <div class="nec-player-list-banner">
        <span>播放清单</span>
        <el-icon
          class="nec-player-list-close"
          @click="closeSongList"
        >
          <el-icon-close />
        </el-icon>
      </div>
      <div class="nec-player-list-wrapper">
        <div
          v-for="(item, activeId) in songList"
          :key="item.url"
          :class="{
            'nec-player-list-detail-wrapper': true,
            'active-wrapper': index === activeId,
          }"
        >
          <div class="nec-player-list-detail">
            <span>
              <el-icon
                class="list-btn-play"
                @click="playFromList(activeId, item.id)"
              ><el-icon-video-play /></el-icon>
            </span>
            <span>{{ item.name }}</span>
            <el-divider direction="vertical" />
            <span
              v-for="(itemArtist, idx) in item.artists"
              :key="itemArtist.id"
            >
              {{ itemArtist.name }}<span v-if="idx < item.artists.length - 1">/</span>
            </span>
            <span>
              <el-icon
                class="list-btn-delete"
                @click="removeSongs(activeId)"
              >
                <el-icon-delete />
              </el-icon>
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-row>
</template>

<script>
import {
  Close as ElIconClose,
  VideoPlay as ElIconVideoPlay,
  Delete as ElIconDelete,
} from '@element-plus/icons-vue'
function formatTime(sec) {
  if (typeof sec === 'string' || typeof sec === 'number') {
    sec = parseInt(sec)
  }
  let minutes = Math.floor(sec / 60)
  sec = sec - minutes * 60
  return ('0' + minutes).slice(-2) + ':' + ('0' + sec).slice(-2)
}
export default {
  name: 'AudioPlayer',
  components: {
    ElIconClose,
    ElIconVideoPlay,
    ElIconDelete,
  },
  props: {
    songInfo: {
      type: Object,
      default: () => ({})
    },
    orderChange: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      playing: false,
      totalTime: 0,
      currentTime: 0,
      picUrl:
        'https://s4.music.126.net/style/web2/img/default/default_album.jpg?param=40y40',
      sliderTime: 0,
      disabled: true,
      expandList: false,
      songList: [],
      continue: false,
      baseUrl: 'https://music.163.com/song/media/outer/url?id=',
      url: '',
      index: -1,
      volume: 100,
      canplay: false
    }
  },
  watch: {
    songInfo: {
      handler() {
        console.log(this.songInfo)
        this.insertIntoSongList(JSON.parse(JSON.stringify(this.songInfo)))
        if (this.orderChange) {
          this.playFromList(this.index, this.songInfo.id)
        }
      },
      deep: true,
    },
  },
  created() {
    window.addEventListener('beforeunload', (e) => this.unload(e))
    this.initialSongList()
  },
  mounted() {
    if (JSON.parse(localStorage.getItem('volume')) === null) {
      localStorage.setItem('volume', '1')
    }
    let volume = localStorage.getItem('volume') * 100
    this.volume = volume
    this.$refs.audio.volume = volume / 100
    // this.changeVolume()
  },
  beforeUnmount() {
    window.removeEventListener('beforeunload', () => {})
  },
  methods: {
    handleCanplay() {
      console.log('handleCanplay')
    },
    initialSeconds(second = 0) {
      return formatTime(second)
    },
    unload() {
      this.songList = JSON.parse(localStorage.getItem('songList'))
      localStorage.setItem('songList', JSON.stringify(this.songList))
      this.index = parseInt(localStorage.getItem('index'))
      localStorage.setItem('index', isNaN(this.index) ? 0 : this.index)
      localStorage.setItem('volume', localStorage.getItem('volume'))
    },
    initialSongList() {
      if (
        JSON.parse(localStorage.getItem('songList')) === null ||
        JSON.parse(localStorage.getItem('songList') === null)
      ) {
        localStorage.setItem('songList', JSON.stringify(this.songList))
        localStorage.setItem('index', this.index)
      }
      this.songList = JSON.parse(localStorage.getItem('songList'))
      this.index = parseInt(localStorage.getItem('index'))
      if (this.songList.length !== 0 && this.index > -1) {
        this.axios
          .get('/song/detail?ids=' + this.songList[this.index].id)
          .then((res) => {
            this.picUrl = res.data.songs[0].al.picUrl + '?param=40y40'
            this.url = this.baseUrl + this.songList[this.index].id + '.mp3'
          })
          .catch((err) => {
            console.log(err)
            this.$message.error('网络出错啦')
          })
      }
    },
    changeVolume() {
      this.$refs.audio.volume = this.volume / 100
      localStorage.setItem('volume', this.$refs.audio.volume)
    },
    insertIntoSongList(singleSong) {
      let index = this.songList.findIndex((x) => x.id === singleSong.id)
      if (index > -1) {
        this.$message.info('已在播放列表里')
        this.index = index
      } else {
        this.songList.push(singleSong)
        this.$message.success('成功加入播放列表')
        if (this.orderChange) {
          this.index = this.songList.length - 1
        }
        localStorage.setItem('songList', JSON.stringify(this.songList))
        localStorage.setItem('index', this.index)
      }
    },
    removeSongs(index) {
      if (this.songList.length === 1) {
        this.index = -1
        this.songList.splice(0, 1)
        this.url = ''
        this.totalTime = 0
        this.sliderTime = 0
        this.picUrl =
          'https://s4.music.126.net/style/web2/img/default/default_album.jpg?param=40y40'
        this.pause()
      } else if (index === this.index) {
        if (index === this.songList.length - 1) {
          this.songList.splice(index, 1)
          let newId = index % this.songList.length
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
        this.index = this.songList.findIndex((x) => x.id === id)
      }
      localStorage.setItem('songList', JSON.stringify(this.songList))
      localStorage.setItem('index', this.index)
    },
    playFromList(index, id) {
      this.pause()
      this.index = index
      this.url = this.baseUrl + id + '.mp3'
      this.axios.get('/song/detail?ids=' + id).then((res) => {
        this.picUrl = res.data.songs[0].al.picUrl + '?param=40y40'
      })
      this.play()
      localStorage.setItem('index', this.index)
    },
    playForward() {
      let len = this.songList.length
      if (len > 0) {
        let id = this.songList[(this.index + 1) % len].id
        this.playFromList((this.index + 1) % len, id)
      }
    },
    playBack() {
      let len = this.songList.length
      if (len > 0) {
        if (this.index === 0) {
          let id = this.songList[len - 1].id
          this.playFromList(len - 1, id)
        } else {
          let id = this.songList[this.index - 1].id
          this.playFromList(this.index - 1, id)
        }
      }
    },
    expandSongList() {
      this.expandList = !this.expandList
    },
    closeSongList() {
      this.expandList = false
    },
    formatProcessToolTip(index = 0) {
      index = parseInt((this.totalTime / 100) * index)
      return formatTime(index)
    },
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = Math.floor((index / 100) * this.totalTime)
    },
    onTimeupdate(res) {
      this.currentTime = res.target.currentTime
      this.sliderTime = Math.ceil((this.currentTime / this.totalTime) * 100)
      if (
        parseInt(this.totalTime) !== 0 &&
        parseInt(this.currentTime) === parseInt(this.totalTime)
      ) {
        this.playForward()
      }
    },
    onCanplay() {
      this.canplay = true
    },
    onLoadedmetadata(res) {
      this.disabled = false
      this.sliderTime = 0
      this.totalTime = parseInt(res.target.duration)
    },
    playOrPause() {
      if (this.$refs.audio.paused) {
        this.play()
      } else {
        this.pause()
      }
    },
    pause() {
      if (!this.$refs.audio.paused) {
        this.$refs.audio.pause()
        this.playing = false
      }
    },
    play() {
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
    played() {
      this.playing = true
      const artistsArr = this.songList[this.index].artists
      let artists = ''
      for (let i = 0; i < artistsArr.length; i++) {
        if (i + 1 === artistsArr.length) {
          artists += artistsArr[i].name
        } else {
          artists += artistsArr[i].name + '/'
        }
      }
      document.title = '▶ ' + this.songList[this.index].name + '-' + artists
    },
    paused() {
      this.playing = false
      document.title = 'NeteaseCloudMusic'
    },
    dragDown() {
      this.continue = this.playing === true
      this.pause()
    },
    dragUp() {
      if (this.continue) {
        this.play()
      } else {
        this.pause()
      }
    },
  },
}
</script>

<style scoped></style>
