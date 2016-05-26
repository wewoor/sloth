# sloth
a simple images lazy load plugin.


# usage

## in html
```html 
	<img sloth-img="url" />
```
### js
```javascript 
<script type="text/javascript">
	// 默认加载body体全部sloth图片
 	var sloth = new Sloth();
 	// 默认滚动条加载
    sloth.init();

    // 手动加载
    sloth.load();

    // 惰性加载Scroll ID 元素内的图片
 	var sloth = new Sloth("#Scroll");
 	
</script>
```


# License
MIT