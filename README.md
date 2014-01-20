![RaytinJS](test/logo.png)
# RaytinJS

> 统一浏览器差异，将原生JavaScript接口封装成命名风格一致，并且语义良好的方法。基于她快速构建Web应用，小巧而实用，这就是Raytin，一个轻量的JavaScript开发类库。

方法命名上借鉴了PHP中的变量，所有的方法都以 $ 符号开始，比如这样获取DOM元素：

```javascipt
$id('#box')
```

Raytin定位为 `敏捷的DOM操作类库`，方法的设计上大量的借鉴了jQuery的语法，降低学习使用成本。

#API
在线API文档: [http://www.jsfor.com/raytin/](http://www.jsfor.com/raytin/selector/get.html)

## Usage

```javascipt
<script type="text/javascript" src="Raytin.core.js"></script>
<script type="text/javascript">
    $DOMReady(function(){
        $event.add($id('#box'), 'click', function(e){
            var name = $text(e.target)
            alert('yeah, I am a box! my name is ' + name);
        });
    });
</script>
```

## 动画
下面这段代码的效果将会是以600毫秒的时间将左边距移动到200像素。

```javascipt
$animate($id('box'), {
    marginLeft: 200
}, 600);
```

动画算法是flash的 `Tween` 类算法，可以达到很优秀的缓动效果。

默认擦除效果类型是 `Quad` ，如果想获得更多的效果，这里提供了动画辅助插件 `Raytin.tween.js` ，引入即可扩展。

```javascipt
<script type="text/javascript" src="Raytin.core.js"></script>
<script type="text/javascript" src="Raytin.tween.js"></script>
```

引入之后可以这样使用：

```javascipt
$animate(
    $id('box'),
    {
        marginLeft: 200
    },
    600,
    'Bounce:easeIn',
    function(){
        alert('动画完成了')
    }
);
```

详细使用方法请参见 [动画API](http://www.jsfor.com/raytin/effect/animate.html)。

# License
本项目基于MIT协议发布

MIT: [http://rem.mit-license.org](http://rem.mit-license.org/) 详见 [LICENSE](/LICENSE) 文件