<template>
  <div id="app">
    <router-view @get-song-info="getSongInfo" />
    <audio-player
      :song-info="songInfo"
      :order-change="orderChange"
    />
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
export default {
  name: 'App',
  components: { AudioPlayer },
  data() {
    return {
      songInfo: {},
      orderChange: false,
    }
  },
  methods: {
    getSongInfo() {
      this.songInfo = JSON.parse(JSON.stringify(arguments[0]))
      this.orderChange = arguments[1]
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
