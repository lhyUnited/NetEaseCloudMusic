<template>
  <div id="app">
    <router-view @getSongInfo="getSongInfo"/>
    <audio-player :song-info="songInfo"></audio-player>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
export default {
  name: 'App',
  components: {AudioPlayer},
  data () {
    return {
      songInfo: {}
    }
  },
  methods: {
    getSongInfo (val) {
      this.songInfo = JSON.parse(JSON.stringify(val))
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
