<template>
  <el-container class="is-vertical">
    <page-header />
    <el-main class="nec-search-result">
      <el-skeleton
        animated
        :loading="loading"
        variant="rect"
        :throttle="500"
      >
        <template #template>
          <el-skeleton-item
            style="width: 100%; height: 30px"
          />
          <el-skeleton-item
            style="width: 100%; height: 30px"
          />
          <el-skeleton-item
            style="width: 100%; height: 30px"
          />
          <el-skeleton-item
            style="width: 100%; height: 30px"
          />
          <el-skeleton-item
            style="width: 100%; height: 30px"
          />
          <el-skeleton-item
            style="width: 100%; height: 30px"
          />
        </template>
        <div>
          <el-table
            :data="songs"
            :header-cell-style="{
              'text-align': 'center',
            }"
            :cell-style="{ 'text-align': 'center' }"
          >
            <el-table-column label="名称">
              <template #default="props">
                <el-link
                  type="primary"
                  @click="getUrl(props.row.id, props.row)"
                >
                  <span>{{ props.row.name }}</span>
                </el-link>
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="props">
                <el-button
                  title="立即播放"
                  :icon="ElIconVideoPlay"
                  type="success"
                  circle
                  size="small"
                  @click="getUrl(props.row.id, props.row)"
                />
                <el-button
                  title="加入清单"
                  :icon="ElIconPlus"
                  type="info"
                  circle
                  size="small"
                  @click="getUrl(props.row.id, props.row, false)"
                />
              </template>
            </el-table-column>
            <el-table-column label="艺人">
              <template #default="props">
                <span
                  v-for="(item, index) in props.row.artists"
                  :key="item.id"
                >
                  {{ item.name }}<span v-if="index < props.row.artists.length - 1">/</span>
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :page-sizes="[10, 30, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            :page-size="limit"
            :current-page="offset"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-skeleton>
    </el-main>
  </el-container>
</template>
<script>
import {
  VideoPlay as ElIconVideoPlay,
  Plus as ElIconPlus,
} from '@element-plus/icons-vue'
import { shallowRef } from "vue"
import PageHeader from '@/components/PageHeader'
export default {
  name: 'SearchResults',
  components: { PageHeader },
  data() {
    return {
      hovered: false,
      keyWord: '',
      results: '',
      songs: [],
      offset: 1,
      total: 0,
      limit: 30,
      songInfo: {
        name: '',
        id: 0,
        url: '',
        artists: [],
      },
      loading: false,
      ElIconVideoPlay: shallowRef(ElIconVideoPlay),
      ElIconPlus: shallowRef(ElIconPlus),
    }
  },
  watch: {
    $route: {
      handler() {
        if (this.$route.query.keyword !== '') {
          this.keyWord = this.$route.query.keyword
          this.initialList()
        }
      },
    },
  },
  created() {
    if (this.$route.query.keyword !== undefined) {
      this.keyWord = this.$route.query.keyword
      this.initialList()
    }
  },
  methods: {
    initialList() {
      this.loading = true
      this.axios
        .get(
          '/search?keywords=' +
            this.keyWord +
            '&limit=' +
            this.limit +
            '&offset=' +
            (this.offset - 1) +
            '&type=1'
        )
        .then((res) => {
          if (res.data.code === 200) {
            this.songs = res.data.result.songs
            this.total = res.data.result.songCount
          }
        })
        .catch(() => {
          this.$message.error('网络出错啦')
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCurrentChange(val) {
      this.offset = val
      this.initialList()
    },
    handleSizeChange(val) {
      this.limit = val
      this.initialList()
    },
    search() {
      this.initialList()
    },
    async getUrl(id, row, orderChange = true) {
      const valid = await this.checkMusic(id)
      if (!valid) return
      await this.getSongInfo(id, row, orderChange)
    },
    async checkMusic(id) {
      try {
        const { data } = await this.axios.get(`/check/music?id=${id}`)
        if (!data.success) this.$message.error(data.message)
        return data.success
      } catch (error) {
        console.log(error)
        // this.$message.error(error)
      }
    },
    async getSongInfo(id, row, orderChange) {
      try {
        const { data } = await this.axios.get(`/song/url?id=${id}`)
        if (data.code === 200) {
          if (data.data[0].url === null) {
            this.$message.error('出于vip限制，未获取到mp3地址')
          } else {
            this.songInfo.id = id
            this.songInfo.url = data.data[0].url
            this.songInfo.name = row.name
            this.songInfo.artists = row.artists
            this.$emit('getSongInfo', this.songInfo, orderChange)
          }
        }
      } catch (error) {
        this.$message.error(error)
      }
    },
  },
}
</script>

<style scoped>
.btn-hover {
  display: none;
}
</style>
