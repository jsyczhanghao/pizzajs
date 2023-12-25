<div style="height: 100%;">
  <div v-if="show">1</div>
  <user-item v-for="list" v-for-item="$item" :info="$item" v-for-index="index" v-key="index" :xxx="index" @click="onClickItem" v-if="!show">
    <!-- <span slot="name">{{$item.name}}</span> -->
   {{$item.fav}}
  </user-item>

  <div v-if="!show">2</div>
  <user-item v-for="list" v-for-item="$item" :info="$item" v-for-index="index" :xxx="index" @click="onClickItem" v-if="show || index % 2 === 1">
    <!-- <span slot="name">{{$item.name}}</span> -->
   {{$item.fav}}
  </user-item>
  <div>3</div>
</div>