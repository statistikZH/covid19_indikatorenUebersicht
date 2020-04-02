<template>
  <q-page>
    <div class="q-ma-md">

      <h2 class="q-mt-lg q-mb-sm text-h6">Links</h2>

      <div class="row q-gutter-sm q-mb-sm items-center">
        <span>Mehr Informationen zum Monitoring:</span>
        <ui-link label="Gesellschaftsmonitoring COVID-19" :href="monitoring" />
      </div>
      <div class="row q-gutter-sm q-mb-sm items-center">
        <span>Download gesammter Datensatz, alle Indikatoren:</span>
        <ui-link label="covid19socialmonitoring.csv (RAW)" :href="urlRepoRaw + socialBeta" />
      </div>
      <div class="row q-gutter-sm q-mb-md items-center">
        <span>Weitere Informationen des Statistischen Amtes zur COVID-19-Krise</span>
        <ui-link label="Analysen und Daten zu COVID-19" :href="statistik" />
      </div>
      <cite>Zitierhinweis: Ursprüngliche Datenherkunft (intervista, SIX, Flughafen Zürich etc.) / "Gesellschaftsmonitoring COVID-19 STAT"</cite>

      <!-- loading or table -->
      <q-linear-progress v-if="meta.length === 0" indeterminate class="q-my-xl" />
      <template v-else>
        <div class="row q-gutter-sm q-mt-xl q-mb-md">
          <q-select label="Filter" v-model="filter.select" :options="filter.options" outlined dense style="min-width:150px" />
          <q-input label="Suche" v-model="search" outlined dense style="min-width:150px">
            <template v-slot:append>
            <q-icon v-if="search !== ''" name="close" @click="search = ''" class="cursor-pointer" />
            <q-icon v-else name="search" />
          </template>
          </q-input>
        </div>
        <q-table
          :data="filterData"
          :columns="columns"
          :pagination.sync="pagination"
          row-key="topic"
          :filter="search"
          grid
          grid-header
        >

          <!-- custom header for stacked table -->
          <template v-slot:header="props">
            <div class="row q-gutter-md" :props="props">
              <div
                v-for="col in props.cols"
                class="col-auto sort_arrow"
                style="cursor:pointer"
                :key="col.name"
                :props="props"
                @click="headerClick(col.field)"
              >
                <!-- custom header (default one with grid option, overlap the page) -->
                <q-icon
                  :name="!pagination.descending || pagination.sortBy !== col.field ? 'arrow_upward' : 'arrow_downward'"
                  :color="pagination.sortBy === col.field ? 'black' : 'white'"
                />
                {{ col.label }}
              </div>
            </div>
          </template>

          <!-- stacked rows -->
          <template v-slot:item="props">
            <div class="q-pa-xs q-py-sm col-12 grid-style-transition block">
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6 col-md-2">
                  <q-item-label caption>Thema</q-item-label>
                  <q-item-label class="text-weight-bold">{{ props.row.topic }}</q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <q-item-label caption>Indikator</q-item-label>
                  <q-item-label class="text-weight-bold">{{ props.row.variable_long }}</q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <q-item-label caption>Von - bis</q-item-label>
                  <q-item-label>{{ props.row.range }}</q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-2">
                  <q-item-label caption>Periodizität</q-item-label>
                  <q-item-label>{{ props.row.update }}</q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-2">
                  <q-item-label caption>Abdeckung</q-item-label>
                  <q-item-label>{{ props.row.location }}</q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <q-item-label caption>Quelle</q-item-label>
                  <q-item-label>{{ props.row.source }}</q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-4">
                  <q-item-label caption>Doku</q-item-label>
                  <q-item-label>
                    <q-chip square class="q-ma-none q-pa-none" color="grey-2">
                      <ui-sparkline :dot="2" :data="props.row.group.map(o => o.value)" style="float:right" />
                    </q-chip>
                    <a :href="props.row.description" target="_blank" style="text-decoration:none">
                      <q-icon name="info" color="blue-6" size="md" text-color="white" class="q-ml-sm" />
                    </a>
                  </q-item-label>
                </div>
                <div class="col-12 col-sm-6 col-md-2">
                  <q-item-label caption>Download</q-item-label>
                  <q-item-label>
                    <ui-download label="CSV" color="bg-green-4" @click.native="$statUtils.exportCSVfromObj(fileName(props.row) + '.csv', props.row.group)" class="q-mb-sm q-mr-sm" />
                    <ui-download label="JSON" color="bg-orange-4" @click.native="$statUtils.exportJSONfromObj(fileName(props.row) + '.json', props.row.group)" class="q-mb-sm" />
                  </q-item-label>
                </div>
              </div>
            </div>
          </template>
        </q-table>
      </template>

      <!-- license -->
      <div class="row q-gutter-sm q-mb-md items-center">
        <span>MIT License:</span>
        <ui-link :href="license" />
      </div>

    </div>
  </q-page>
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
import UiLink from 'src/components/UiLink.vue'
import UiDownload from 'src/components/UiDownload.vue'
import UiSparkline from 'src/components/UiSparkline.vue'
export default {
  name: 'PageIndex',
  components: {
    UiLink,
    UiDownload,
    UiSparkline
  },
  data () {
    return {
      urlRepoRaw: 'https://raw.githubusercontent.com/statistikZH/covid19monitoring/',
      urlRepo: 'https://github.com/statistikZH/covid19monitoring/blob/',
      metadata: 'master/Metadata.csv',
      socialBeta: 'master/covid19socialmonitoring.csv',
      license: 'https://github.com/statistikZH/covid19_indikatorenUebersicht/blob/master/LICENSE',
      statistik: 'https://statistik.zh.ch/internet/justiz_inneres/statistik/de/covid19.html',
      monitoring: 'https://statistikzh.github.io/covid19monitoring',
      filter: {
        select: 'Alle',
        options: []
      },
      // table defs ---------------------------------------------------------------------------
      columns: [
        {
          name: 'topic',
          align: 'left',
          label: 'Thema',
          field: 'topic',
          sortable: true
        },
        {
          name: 'variable_long',
          align: 'left',
          label: 'Indikator',
          field: 'variable_long',
          sortable: true
        },
        {
          name: 'update',
          align: 'left',
          label: 'Periodizität',
          field: 'update',
          sortable: true
        },
        {
          name: 'location',
          align: 'left',
          label: 'Abdeckung',
          field: 'location',
          sortable: true
        },
        {
          name: 'source',
          align: 'left',
          label: 'Quelle',
          field: 'source',
          sortable: true
        }
      ],
      pagination: {
        sortBy: 'topic',
        descending: false,
        rowsPerPage: 50
      },
      // data defs ---------------------------------------------------------------------------
      meta: [],
      search: ''
    }
  },
  computed: {
    filterData () {
      if (this.filter.select === 'Alle') {
        return this.meta
      }
      return this.meta.filter(o => o.topic === this.filter.select)
    }
  },
  methods: {
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
    },
    headerClick (field) {
      if (this.pagination.sortBy === field) {
        if (this.pagination.descending === true) {
          this.pagination.sortBy = null
        } else if (this.pagination.descending === false) {
          this.pagination.descending = true
        }
      } else {
        this.pagination.sortBy = field
        this.pagination.descending = false
      }
    },
    dateRange (data) {
      const dates = data.map(o => this.$statUtils.sortDateToSeconds(o.date))
      const from = this.$statUtils.sortToLabelDate(this.$statUtils.secondsToLabelDate(Math.min(...dates)))
      const to = this.$statUtils.sortToLabelDate(this.$statUtils.secondsToLabelDate(Math.max(...dates)))
      return `${from} bis ${to}`
    }
  },
  mounted () {
    this.$statUtils.loadCSV(
      this.urlRepoRaw + this.metadata,
      (array) => {
        let meta = array

        // unique options for filter select
        this.filter.options = ['Alle', ...new Set(array.map(o => o.topic))]

        this.$statUtils.loadCSV(
          this.urlRepoRaw + this.socialBeta,
          (array2) => {
            // append to all meta item the filtered data
            meta = meta.map(o => {
              o.group = array2.filter(e => {
                return o.topic === e.topic && o.variable_short === e.variable_short && o.location === e.location
              })
              o.range = this.dateRange(o.group)
              return o
            })
            this.meta = meta
          }
        )
      }
    )
  }
}
</script>
