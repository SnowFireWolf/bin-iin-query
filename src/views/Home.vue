<template>
  <div class="min-h-screen container mx-auto py-4 bg-grey-100" style="max-width: 840px;">

    <h2 class="mt-20 text-center text-3xl font-extrabold text-gray-900">
      BIN/IIN 資訊查詢
    </h2>
    
    <v-card class="mt-10">
      <div class="mt-1">
        <div class="font-bold text-xl mb-2">查詢</div>
      </div>

      <input
          v-model="cardNumber"
          class="mt-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          type="text"
          name="cardNumber"
          autocomplete="off"
          placeholder="貼上卡號，例如： 4283 VISA"
        />

      <p class="text-sm text-gray-500">
        輸入 IIN / BIN
      </p>
    </v-card>

    <!-- search button -->
    <v-button
      @click="search"
      class="mt-5"
    >
      <template v-if="loading">
        <spinner />
        <span>查詢中...</span>
      </template>
      <span v-else>查詢</span>
    </v-button>

    <!-- card result -->
    <v-card v-if="error" class="mt-10">
      <div class="font-bold text-red-900 text-2xl">查詢錯誤</div>
      <p class="mt-3">沒有查詢到資訊</p>
      <p
        v-if="errorCode === 429"
        class="mt-3"
      >超過每分鐘查詢限制</p>
      
    </v-card >

    <div v-if="cardResult.length !== 0 && !error" class="mt-10 border bg-white shadow-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="font-bold text-green-900 text-3xl">資訊</div>

        <div class="mt-3 grid grid-cols-1 sm:grid-cols-12">
          <div class="col-span-6">
            <div class="text-lg font-bold text-green-900">SCHEME / NETWORK</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.scheme }}</div>
          </div>

          <div class="col-span-6">
            <div class="text-lg font-bold text-green-900">類型</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.type }}</div>
          </div>
        </div>


        <div class="mt-10 font-bold text-green-900 text-3xl">銀行</div>
        <div class="xl:grid grid-cols-1 sm:grid-cols-12">
          <div class="col-span-6">
            <div class="mt-2 text-lg font-bold text-green-900">名稱</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.bank.name }}</div>
          </div>

          <div class="col-span-6">
            <div class="text-lg font-bold text-green-900">網站</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.bank.url }}</div>
          </div>

          <div class="col-span-6">
            <div class="text-lg font-bold text-green-900">電話</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.bank.phone }}</div>
          </div>
        </div>
        
        <div class="text-lg font-bold text-green-900">品牌</div>
        <div class="mt-0 text-2xl font-bold text-red-800">{{ cardResult.brand }}</div>

        <div class="text-lg font-bold text-green-900">預付</div>
        <div class="text-2xl font-bold text-red-800">
          <span v-if="cardResult.prepaid">可用</span>
          <span v-else>無法使用</span>
        </div>

        <div class="mt-10 font-bold text-green-900 text-3xl">卡片號碼</div>
        <div class="mt-1 xl:grid grid-cols-1 sm:grid-cols-12">
          <div class="col-span-6">
            <div class="mt-2 text-lg font-bold text-green-900">長度</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.number.length }}</div>
          </div>

          <div class="col-span-6">
            <div class="mt-2 text-lg font-bold text-green-900">LUNH</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.number.luhn }}</div>
          </div>
        </div>
        

        <div class="mt-10 font-bold text-green-900 text-3xl">國家</div>
        <div class="mt-1 xl:grid grid-cols-1 sm:grid-cols-12">
          <div class="col-span-6">
            <div class="mt-2 text-lg font-bold text-green-900">名稱</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.country.name }}</div>
          </div>

          <div class="col-span-6">
            <div class="mt-2 text-lg font-bold text-green-900">國家代碼</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.country.numeric }}</div>
          </div>

          <div class="col-span-6">
            <div class="mt-2 text-lg font-bold text-green-900">貨幣</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.country.currency }}</div>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-1 sm:grid-cols-12">
          <div class="col-span-6">
            <div class="text-lg font-bold text-green-900">緯度</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.country.latitude }}</div>
          </div>

          <div class="col-span-6">
            <div class="text-lg font-bold text-green-900">經度</div>
            <div class="text-2xl font-bold text-red-800">{{ cardResult.country.longitude }}</div>
          </div>
        </div>
      </div>
    </div>

    <v-footer/>
  </div>
</template>



<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios'

import Spinner from '@/components/Spinner.vue'
import VCard from '@/components/Card.vue'
import VButton from '@/components/Button.vue'
import VFooter from '@/components/Footer.vue'

export default defineComponent({
  name: 'Home',

  components: {
    VCard,
    VButton,
    VFooter,
    Spinner
  },
  
  data() {
    return {
      error: false,
      errorCode: Number,
      loading: false,

      cardNumber: '',
      cardResult: []
    }
  },

  methods: {
    async search() {
      let cardNumber = this.cardNumber.replace(/\s/g, '')

      if(cardNumber.length !== 0 && cardNumber !== '') {
        this.loading = true

        await this.resquestSearch(cardNumber)

        this.$router.push({path:'/',
          query: {
            number: this.cardNumber
          }
        })
      }
    },

    async resquestSearch(number: string) {
      await axios.get(`https://lookup.binlist.net/${number}`, {
        headers: {'Accept-Version': '3'}
      })
      .then((res) => {
        this.cardResult = res.data
        this.error = false
      })
      .catch((err) => {
        this.error = true
        this.errorCode = err.response.status
      }).finally(() => { this.loading = false})
    }
  },

  async mounted() {
    let urlQueryString = this.$route.query.number as string
    if(urlQueryString === undefined) { urlQueryString = ''}

    if(urlQueryString !== '') {
      this.cardNumber = urlQueryString
      await this.resquestSearch(urlQueryString)

      this.$router.push({path:'/',
        query: {
          number: urlQueryString
        }
      })
    }

  }

});
</script>



<style>
#app {
  background-color: #f9f8f2
}
</style>