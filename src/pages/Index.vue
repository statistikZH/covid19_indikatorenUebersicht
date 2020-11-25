<template>
  <div>
    <!-- loading or table -->
    <q-linear-progress v-if="meta.length === 0" indeterminate />
    <template v-else>

      <!-- filter -->
      <div class="row q-col-gutter-s8 q-mb-s40">
        <z-select label="Filter" v-model="filter.select" :options="filter.options" style="min-width:150px" />
        <z-input placeholder="Suche" v-model="filter.search" search clearable />
      </div>

      <!-- table sort -->
      <div class="row q-col-gutter-x-s16">
        <div
          class="col-auto cursor-pointer"
          v-for="(item, index) in columns" :key="index"
          @click="
            sort.key === item.field ? sort.asc = !sort.asc : sort.asc = true
            sort.key = item.field
          "
        >
          <span :class="{ 'text-heading': sort.key === item.field }">{{ item.label }}</span>
          <div style="width:20px; display:inline-block">
            <q-icon :name="sort.asc ? $zhicons.arrowDown : $zhicons.arrowUp" size="xs" color="zhblue" v-if="sort.key === item.field" />
          </div>
        </div>
      </div>

      <!-- table -->
      <z-data-filter :data="sortArray" :count="count">
        <template slot-scope="{ item }">
          <div class="row bg-zhblack5 q-mt-s8">
            <div class="col">
              <div class="q-pa-s8 q-py-s16 col-12">
                <div class="row q-col-gutter-s16">
                  <div class="col-12 col-sm-6 col-md-2">
                    <q-item-label caption>Thema</q-item-label>
                    <q-item-label class="text-heading">{{ item.topic }}</q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-5">
                    <q-item-label caption>Indikator</q-item-label>
                    <q-item-label class="text-heading">{{ item.variable_long }}</q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-item-label caption>Von - bis</q-item-label>
                    <q-item-label>
                      {{ item.date_first_obs.split('-').reverse().join('.') }}
                      bis
                      {{ item.date_last_obs.split('-').reverse().join('.') }}
                    </q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-2">
                    <q-item-label caption>Periodizität / Einheit</q-item-label>
                    <q-item-label>{{ item.update }} / {{ item.unit }}</q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-2">
                    <q-item-label caption>Abdeckung</q-item-label>
                    <q-item-label>{{ item.location }}</q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-5">
                    <q-item-label caption>Quelle</q-item-label>
                    <q-item-label>{{ item.source }}</q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-3">
                    <q-item-label caption>Doku</q-item-label>
                    <q-item-label>
                      <a :href=" item.description" target="_blank" style="text-decoration:none">
                        <q-icon :name="$zhicons.getInformation" size="sm" color="zhblue" />
                      </a>
                    </q-item-label>
                  </div>
                  <div class="col-12 col-sm-6 col-md-2">
                    <q-item-label caption>Download</q-item-label>
                    <q-item-label>
                      <ui-download label="CSV" color="bg-green-4" @click.native="goToCSV(item)" class="q-mb-sm q-mr-sm" />
                      <ui-download label="JSON" color="bg-orange-4" @click.native="getJSON(item)" class="q-mb-sm" />
                    </q-item-label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </z-data-filter>

      <!-- license -->
      <z-link :url="license" label="MIT License" target="_blank" :iconRight="$zhicons.arrowRight" />

    </template>
  </div>
</template>

<style>
.block {
  border: 0px solid rgba(0, 0, 0, 0.12);
  border-bottom-width: 1px;
}
.block:first-child {
  border-top-width: 1px;
}
.sort_arrow:hover i {
  color: #999 !important;
}
</style>

<script>
import UiDownload from 'src/components/UiDownload.vue'
export default {
  name: 'PageIndex',
  components: {
    UiDownload,
    'z-select': () => import('quasar-app-extension-zhwebcomponents/src/component/atom/ZSelect.vue'),
    'z-input': () => import('quasar-app-extension-zhwebcomponents/src/component/atom/ZInput.vue'),
    'z-data-filter': () => import('quasar-app-extension-zhwebcomponents/src/component/atom/ZDataFilter.vue'),
    'z-link': () => import('quasar-app-extension-zhwebcomponents/src/component/atom/ZLink.vue')
  },
  data () {
    return {
      urlRepoRaw: 'https://raw.githubusercontent.com/statistikZH/covid19monitoring/',
      urlRepo: 'https://github.com/statistikZH/covid19monitoring/blob/',
      metadata: 'master/Metadata.csv',
      license: 'https://github.com/statistikZH/covid19_indikatorenUebersicht/blob/master/LICENSE',
      filter: {
        select: 'Alle',
        options: [],
        search: ''
      },
      // table defs ---------------------------------------------------------------------------
      sort: {
        key: 'topic',
        asc: true
      },
      columns: [
        {
          label: 'Thema',
          field: 'topic'
        },
        {
          label: 'Indikator',
          field: 'variable_long'
        },
        {
          label: 'Periodizität',
          field: 'update'
        },
        {
          label: 'Abdeckung',
          field: 'location'
        },
        {
          label: 'Quelle',
          field: 'source'
        }
      ],
      count: 5,
      // data defs ---------------------------------------------------------------------------
      meta: []
    }
  },
  watch: {
    'filter.select' (newVal) {
      this.updateRouter()
    }
  },
  computed: {
    filterData () {
      const search = this.filter.search.toLowerCase()
      return this.meta
        .filter(o => o.topic === this.filter.select || this.filter.select === 'Alle') // select
        .filter(o => {
          for (const key of Object.keys(o)) {
            if (o[key].toLowerCase().includes(search)) {
              return true
            }
          }
          return false
        }) // search
    },
    sortArray () {
      return JSON.parse(JSON.stringify(this.filterData)).sort((a, b) => {
        return this.sort.asc
          ? (a[this.sort.key] > b[this.sort.key] ? 1 : a[this.sort.key] < b[this.sort.key] ? -1 : 0)
          : (a[this.sort.key] < b[this.sort.key] ? 1 : a[this.sort.key] > b[this.sort.key] ? -1 : 0)
      })
    }
  },
  methods: {
    getVariablePath (row) {
      return `${this.urlRepoRaw}master/variables/${row.id}.csv`
    },
    goToCSV (row) {
      this.$statUtils.loadCSV(
        this.getVariablePath(row),
        (array) => {
          this.$statUtils.exportCSVfromObj(this.fileName(row) + '.csv', array)
        }
      )
    },
    getJSON (row) {
      this.$statUtils.loadCSV(
        this.getVariablePath(row),
        (array) => {
          this.$statUtils.exportJSONfromObj(this.fileName(row) + '.json', array)
        }
      )
    },
    updateRouter () {
      this.$router.push('/' + this.filter.select).catch(() => {})
    },
    fileName (row) {
      let string = `Covid-19_${row.variable_short}_${row.location}_${row.source}_` + new Date().toLocaleDateString().replace(' ', '_')
      string = string.replace(/ä/g, 'ae')
      string = string.replace(/ö/g, 'oe')
      string = string.replace(/ü/g, 'ue')
      string = string.replace(/Ä/g, 'Ae')
      string = string.replace(/Ö/g, 'Oe')
      string = string.replace(/Ü/g, 'Ue')
      string = string.replace(/\W+/g, '-')
      return string
    }
  },
  created () {
    if (this.$route.params.filter) {
      this.filter.select = this.$route.params.filter
    }
  },
  mounted () {
    this.$statUtils.loadCSV(
      this.urlRepoRaw + this.metadata,
      (array) => {
        this.meta = array
        this.filter.options = ['Alle', ...new Set(array.map(o => o.topic))]
      }
    )
  }
}
</script>
