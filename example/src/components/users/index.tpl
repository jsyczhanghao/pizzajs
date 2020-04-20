<div style="height: 100%;">
  <user-item v-for="list" v-for-item="$item" :info="$item" v-for-index="index" v-key="$item.key" @click="onClickItem">
    <!-- <span slot="name">{{$item.name}}</span> -->
   {{$item.fav}}
  </user-item>
</div>