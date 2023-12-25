<section class="user" @click="onClick" data-xx="user">
  <span class="name"><slot name="name">{{user.key}} - {{user.name}}</slot></span>
  <slot>{{user.fav}}</slot>
</section>