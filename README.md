# pizza
轻量mvvm框架，用来演示小程序引擎开发, 基于virtual-dom，diff算法上和react及vue稍微有些不同。
组件这块基于webcomponent，所以隔离性会更强些。

### 使用

```js
new Pizza({
  template: '<user-list :list="users" />',
  component: {
    UserList
  },

  data: {
    users: [1, 2, 3]
  },
}).$mount(document.getElementById('app'));
```

userlist
```js
import __template from './userlist.tpl';
import __style from './userlist.css';

export default {
  props: {
    list: []
  },

  template: __template,
  style: __style
};
```

userlist.css
```css
div {
  color: red;
}

:host {
  display: block;
}
```

userlist.tpl
```html
<div class="demo" v-for="list" v-for-item="user">
  {{user}}
</div>
```