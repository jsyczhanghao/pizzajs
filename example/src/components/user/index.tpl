<div class="user" @click="onClick" data-xx="info">
  <span class="name"><slot name="name">{{info.name}}</slot></span>
  <slot>{{info.fav}}</slot>
</div>