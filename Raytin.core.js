/*
 * Raytin JavaScript Framework
 * http://raytin.jsfor.com/
 *
 * 作者：柳裟
 * 联系方式：superRaytin@163.com
 * Version：1.0.0
 * 日期：2012/2/24
 *
 * 访问 http://raytin.jsfor.com/ 获取最新版本
*/
(function(window){
	var Raytin,
	  	document = window.document,
		navigator = window.navigator,
		userAgent = navigator.userAgent.toLowerCase(),
		rid = /^\s*#([a-zA-Z]+[\w_]*)/,
		rclass = /^\s*\.([a-zA-Z]+[\w_]*)/,
		rsplit = /\s*,\s*/,
		rhtml = /^<([a-zA-Z]+)(\s+([a-zA-Z]+)=['|"]+(.*)['|"]+)*>.*(<\/[a-zA-Z]+>)$/,
		rtag = 'div|img|span|p|a|strong|b|h1|h2|h3|h4|h5|h6|ul|li|ol|table|thead|tbody|'+
		'tfoot|tr|td|form|input|select|option|button|textarea|u|s|i|html|body|head',
		rbackone = /^\s*#([a-zA-Z]+[\w_-]*)|body|head$/;

	Raytin = {
		/*
		*  @ 获取对象
		*/ 
		$get : function( element ){
			var res = [];
			if( typeof element === 'string' ){
				var els = element.split( rsplit );
				$each( els,function( i,item ){
					var matRes = Raytin._matchSelector(item);
					if( matRes ){
						res = res.concat(matRes);
					};
				});
			}
			else{
				if( element.tagName ){
					return [$id(element)];
				}
				else if( element.item ){
					return $tag(element);
				}
				else if( element instanceof Array ){
					return element;
				};
			};
			return res;
		},
		/*
		*  @ 通过元素ID获取DOM对象
		*/ 
		$id : function( element ){
			if( typeof element === 'string' && element !== '' ) return document.getElementById(element);
			return element;
		},
		/*
		*  @ 通过元素Class获取DOM对象
		*/ 
		$class : function( str,context ){
			if( typeof str !== 'string' || str === '' ){
				return
			};
			var root = typeof context === 'undefined' ? document : context;
			if( root.getElementsByClassName ){
				return $arr.makeArray( root.getElementsByClassName(str) );
			}
			else{
	  			var els = root.all ? root.all : root.getElementsByTagName("*"),
	  				res = [];
				$each( els,function( i,item ){
					var curClass = item.className,
						reg = new RegExp('\\b' + str + '\\b');
					reg.test( curClass ) && res.push( item );
				});
				return res;
			};
		},
		/*
		*  @ 通过元素名获取DOM对象
		*/ 
		$tag : function( element,context ){
			var root = typeof context === 'undefined' ? document : context,
				tagExp = new RegExp("^(" + rtag + ")$","i");
			if( element.item ){
				return $arr.makeArray( element );
			}
			else if( typeof element === "string" && ( element === '*' || tagExp.test( element ) ) ){
				if( /^body|head|html$/.test( element ) ){
					return root.getElementsByTagName( element )[0];
				};
				return $arr.makeArray( root.getElementsByTagName( element ) );
			};
		},
		_matchSelector : function( str ){
			var tagExp = new RegExp("^(" + rtag + ")$","i");
			if( str.match( rid ) ){
				return [this.$id( RegExp.$1 )];
			}
			else if( str.match( rclass ) ){
				return this.$class( RegExp.$1 );
			}
			else if( str.match( tagExp ) ){
				return this.$tag( RegExp.$1 );
			}
			else{
				return null;
			};
		},
		/*
		*  @ 获取下一个元素
		*/
		$next : function( element ){
			var res = [];
			$each( element,function( i,item ){
				var label = item;
				while( ( label = label.nextSibling ) && label.nodeType != 1 );
				label && res.push( label );
			});
			return res;
		},
		/*
		*  @ 获取匹配元素之后的所有同辈元素
		*/
		$nextAll : function( element,bool ){
			var res = [];
			$each( element,function( i,item ){
				var label = item,
					temp = [];
				if( typeof bool === 'undefined' ){
					while( ( label = label.nextSibling ) ){
						if( label.nodeType == 1 ) temp.push( label );
					};
				}
				else{
					while( ( label = label.nextSibling ) ){
						temp.push( label );
					};
				};
				res = res.concat( temp );
			});
			return res;
		},
		/*
		*  @ 获取上一个元素
		*/
		$prev : function( element ){
			var res = [];
			$each( element,function( i,item ){
				var label = item;
				while( ( label = label.previousSibling ) && label.nodeType != 1 );
				label && res.push( label );
			});
			return res;
		},
		/*
		*  @ 获取匹配元素之前的所有同辈元素
		*/
		$prevAll : function( element,bool ){
			var res = [];
			$each( element,function( i,item ){
				var label = item,
					temp = [];
				if( typeof bool === 'undefined' ){
					while( label = label.previousSibling ){
						if( label.nodeType == 1 ) temp.push( label );
					};
				}
				else{
					while( label = label.previousSibling ){
						temp.push( label );
					};
				};
				res = res.concat( temp.reverse() );
			});
			return res;
		},
		/*
		*  @ 获取同辈元素
		*/
		$siblings : function( element ){
			var res = [];
			$each( element,function( i,item ){
				res = res.concat( $prevAll(item).concat( $nextAll(item) ) );					
			});
			return res;
		},
		/*
		*  @ 获取元素的父级元素
		*/
		$parent : function( element ){
			var res = [];
			$each( element,function( i,item ){
				var par = item.parentNode;
				if( par ){
					while( par.nodeType != 1 ){
						par = par.parentNode;
					};
					res.push( par );
				};
			});
			return res;
		},
		/*
		*  @ 获取匹配元素的子元素
		*/
		$children : function( element ){
			var res = [];
			$each( element,function( i,item ){
				var child = item.childNodes;
				$each( child,function( j,jtem ){
					if( jtem.nodeType == 1 ){
						res.push( jtem );
					};				  
				});
			});
			return res;
		},
		/*
		*  @ 获取匹配元素的第一个元素
		*/
		$first : function( element ){
			return $get(element)[0];
		},
		/*
		*  @ 获取匹配元素的最后一个元素
		*/
		$last : function( element ){
			var el = $get(element);
			return el[el.length - 1];
		},
		/*
		*  @ 判断元素集是否包含某个DOM节点
		*/
		$hasNode : function( element,node ){
			for( var i = 0 , len = element.length ; i < len ; i++ ){
				if( element[i] == node ){
					return true;
				};
			};
			return false;
		},
		/*
		*  @ 判断对象是否包含指定DOM
		*/
		$contains : function( parent,child ){
			return parent.contains ? parent !== child && parent.contains( child ) : !!( parent.compareDocumentPosition( child ) & 16 );
		},
		/*
		*  @ 筛选出与指定表达式匹配的元素集合
		*/
		$filter : function( element,expr ){
			var res = [],
				tagExp = new RegExp("^(" + rtag + ")$","i");
			if( typeof expr === 'string' ){
				expr = expr.toLowerCase();
				var filt = expr.split( rsplit );
				$each( filt,function( i,item ){
					if( item.match( rid ) ){
						$each( element,function( j,jtem ){
							if( $attr.get( jtem,'id' ) == RegExp.$1 ){
								res.push( jtem );
							};					
						});
					}
					else if( item.match( rclass ) ){
						var reg = new RegExp('\\b' + RegExp.$1 + '\\b');
						$each( element,function( j,jtem ){
							if( reg.test( jtem.className ) ){
								res.push( jtem );
							};					
						});
					}
					else if( item.match( tagExp ) ){
						$each( element,function( j,jtem ){
							if( jtem.tagName.toLowerCase() == RegExp.$1 ){
								res.push( jtem );
							};					
						});
					};
				});
			}
			// parameter is DOMElement
			else if( expr.tagName ){
				if( $hasNode( element,expr ) ){
					return expr;
				};
			};
			// expr is '#id' or 'head,body' return DOMElement
			return res.length == 1 && rbackone.test( expr ) ? res[0] : res;
		},
		/*
		*  @ 搜索所有与指定表达式匹配的元素
		*/
		$find : function( element,expr,deep ){
			var res = [];
			$each( element,function( i,item ){
				var child = typeof deep === 'undefined' ? $tag( '*',item ) : $children( item ),
					filter = $filter( child,expr );
				filter instanceof Array ? res = res.concat( filter ) : res.push( filter );
			});
			// expr is '#id' or 'head,body' return DOMElement
			return res.length == 1 && rbackone.test( expr ) ? res[0] : res;
		},
/*
* ============ class ============
*/ 
		/*
		*  @ 检查当前的元素是否含有某个特定的类
		*/
		$hasClass : function( element,name ){
			var el = element instanceof Array ? element[0] : element;
			return new RegExp("\\b" + name + "\\b").test( el.className );
		},
		/*
		*  @ 为每个匹配的元素添加指定的类名
		*/
		$addClass : function( element,name ){
			$each( element,function( i,item ){
				var curClass = item.className,
					rname = name;
					
				if( typeof name === 'function' ){
					// 函数返回值不正确 则中断
					if( !( rname = name.call(item,i,curClass) ) ) return;
				};
					
				var mat = new RegExp('\\b' + rname + '\\b','g').test( curClass );
				if( !mat ){
					item.className += ' ' + rname;
				};
			});
			return element;
		},
		/*
		*  @ 从所有匹配的元素中删除全部或者指定的类
		*/
		$removeClass : function( element,name ){
			var removeAll = typeof name === 'undefined';
			$each( element,function( i,item ){
				if( removeAll ){
					item.className = '';
				}
				else{
					var curClass = item.className,
						rname = name;
						
					if( typeof name === 'function' ){
						// 函数返回值不正确 则中断
						if( !( rname = name.call(item,i,curClass) ) ) return;
					};
					
					var reg = new RegExp('\\s*\\b' + rname + '\\b','g'),
						mat = reg.test( curClass );
						
					if( mat ){
						item.className = curClass.replace( reg,'' );
					};
				};
			});
			return element;
		},
		/*
		*  @ 存在（不存在 ）就删除（增加）一个类
		*/
		$toggleClass : function( element,name,bool ){
			$each( element,function( i,item ){
				var curClass = item.className,
					rname = typeof name === 'string' ? name : typeof name === 'function' ? name.call( item,i,curClass ) : name;

				if( !rname ) return false;

				var	reg = new RegExp('\\s*\\b' + rname + '\\b','g'),
					mat = reg.test( curClass );
				
				// normal
				if( typeof bool === 'undefined' ){
					item.className = mat ? curClass.replace( reg,'' ) : curClass + ' ' + rname;
				}
				// 根据bool参数来决定操作，true则添加，否则删除
				else{
					if( bool ){
						if( !mat ) item.className = curClass + ' ' + rname;
					}
					else{
						if( mat ) item.className = curClass.replace( reg,'' );
					};
				};
			});
			return element;
		},
/*
* ============ Dom ============
*/ 
		/*
		*  @ 获取（设置）匹配元素的文本内容
		*/
		$text : function( element,str ){
			if( typeof str == 'undefined' ){
				var res = [];
				$each( element,function( i,item ){
					res.push( item.innerText || item.textContent );
				});
				return res.join('');
			}
			else{
				$each( element,function( i,item ){
					item.innerText ? item.innerText = str : item.textContent = str;
				});
			};
			return element;
		},
		/*
		*  @ 获取（设置）匹配元素的HTML内容
		*/
		$html : function( element,str ){
			if( typeof str == 'undefined' ){
				var el = element instanceof Array ? element[0] : element;
				return el.innerHTML;
			}
			else{
				$each( element,function( i,item ){
					item.innerHTML = str;
				});
			};
			return element;
		},
		/*
		*  @ 获取（设置）匹配表单元素的value值
		*/ 
		$val : function( element,str ){
			var matInput = /input|textarea/;
			if( typeof str == 'undefined' ){
				var el = element instanceof Array ? element[0] : element;
				return el.value;
			}
			else{
				$each( element,function( i,item ){
					if( matInput.test( item.tagName.toLowerCase() ) ){
						item.value = str;
					};
				});
			};
			return element;
		},
		/*
		*  @ 获取匹配元素的索引
		*/
		$index : function( element,pool ){
			var el = element instanceof Array ? element[0] : element;
			var	parent = $parent( el )[0],
				searchAtea = typeof pool === 'undefined' ? $children( parent ) : pool;
			for( var i = 0 , len = searchAtea.length ; i < len ; i++ ){
				if( searchAtea[i] == el ){
					return i;
				};
			};
			return -1;
		},
		/*
		*  @ 获取匹配元素的个数
		*/
		$size : function( element ){
			return $get(element).length;
		},
		/*
		*  @ 获取（设置）第一个匹配元素当前计算的宽度值
		*/
		$width : function( element,value ){
			if( typeof value === 'undefined' ){
				element = $check.isArray(element) ? element[0] : element;
				return parseFloat( $css.get( element,'width' ) );
			};
			
			// 设置宽度值
			if( typeof value == 'string' || typeof value == 'number' ){
				value = parseFloat( value );
			}
			else if( typeof value == 'function' ){
				value = value.call( element,parseFloat( $css.get(element,'width') ) );
			};
			
			$each( element,function(i,item){
				if( value ) item.style.width = value + 'px';					
			});
		},
		/*
		*  @ 获取第一个匹配元素内部区域宽度（包括补白、不包括边框）
		*/
		$innerWidth : function( element ){
			element = $check.isArray(element) ? element[0] : element;
			return element.clientWidth;
		},
		/*
		*  @ 获取第一个匹配元素外部宽度（默认包括补白和边框）
		*/
		$outerWidth : function( element,bool ){
			element = $check.isArray(element) ? element[0] : element;
			return bool ? element.offsetWidth + parseFloat( $css.get( element,'marginLeft' ) ) + parseFloat( $css.get( element,'marginRight' ) ) : element.offsetWidth;
		},
		/*
		*  @ 获取（设置）第一个匹配元素当前计算的高度值
		*/
		$height : function( element,value ){
			if( typeof value === 'undefined' ){
				element = $check.isArray(element) ? element[0] : element;
				return parseFloat( $css.get( element,'height' ) );
			};
			
			// 设置高度值
			if( typeof value == 'string' || typeof value == 'number' ){
				value = parseFloat( value );
			}
			else if( typeof value == 'function' ){
				value = value.call( element,parseFloat( $css.get(element,'height') ) );
			};
			
			$each( element,function(i,item){
				if( value ) item.style.height = value + 'px';					
			});
		},
		/*
		*  @ 获取第一个匹配元素内部区域高度（包括补白、不包括边框）
		*/
		$innerHeight : function( element ){
			element = $check.isArray(element) ? element[0] : element;
			return element.clientHeight;
		},
		/*
		*  @ 获取第一个匹配元素外部高度（默认包括补白和边框）
		*/
		$outerHeight : function( element,bool ){
			element = $check.isArray(element) ? element[0] : element;
			return bool ? element.offsetHeight + parseFloat( $css.get( element,'marginTop' ) ) + parseFloat( $css.get( element,'marginBottom' ) ) : element.offsetHeight;
		},
		/*
		*  @ 获取第一个匹配元素在当前视口的相对偏移
		*/
		$offset : function( element,coordinates ){
			if( typeof coordinates === 'undefined' ){
				element = $check.isArray(element) ? element[0] : element;
				var docEle = document.documentElement,
					body = document.body,
					clientLeft = docEle.clientLeft || body.clientLeft || 0,
					clientTop = docEle.clientTop || body.clientTop || 0,
					scrollLeft = window.pageXOffset || docEle.scrollLeft || body.scrollLeft,
					scrollTop = window.pageYOffset || docEle.scrollTop || body.scrollTop,
					bound = element.getBoundingClientRect();
					
				return {
					left : bound.left + scrollLeft - clientLeft,
					top : bound.top + scrollTop - clientTop
				};
			};
			
			// 设置元素相对父对象的坐标
			$each( element,function( i,item ){
				var offset = coordinates;
				
				if( typeof coordinates === 'function' ){
					offset = coordinates.call( item,i,$offset( item ) );
				};
				
				// 返回的对象必须包含left和top属性
				if( offset.left && offset.top ){
					if( $css.get( item,'position' ) == 'static' ){
						$css.set( item,'position','relative' );
					};
					
					$style( item,{
						left : parseFloat( offset.left ) + 'px',
						top : parseFloat( offset.top ) + 'px'
					});
				};
			});
		},
		/*
		*  @ 获取匹配元素相对父元素的偏移
		*/
		$position : function( element ){
			element = $check.isArray(element) ? element[0] : element;
			var rroot = /^(?:body|html)$/i,
				
				// get offsetParent of the element
				getOffsetParent = function( em ){
					var offsetParent = em.offsetParent || document.body;
					while( offsetParent && !rroot.test( offsetParent.nodeName ) && $css.get( offsetParent,'position' ) === 'static' ){
						offsetParent = offsetParent.offsetParent;
					};
					return offsetParent;
				},
				
				offset = $offset( element ),
				offsetParent = getOffsetParent( element ),
				parentOffset = rroot.test( offsetParent.nodeName ) ? { left : 0 , top : 0 } : $offset( offsetParent );
			
			return {
				left : offset.left - parentOffset.left - parseFloat( $css.get( offsetParent,'borderLeftWidth') ),
				top : offset.top - parentOffset.top - parseFloat( $css.get( offsetParent,'borderTopWidth' ) )
			};
		},
		/*
		*  @ 向所有匹配的元素尾部插入内容
		*/
		$append : function( target,todo ){
			return Raytin._appendPrependMethod( target,todo,'append' );
		},
		/*
		*  @ 向所有匹配的元素头部插入内容
		*/
		$prepend : function( target,todo ){
			return Raytin._appendPrependMethod( target,todo,'prepend' );
		},
		_appendPrependMethod : function( target,todo,name ){
			// target is a array and todo is a DOM node , clone it
			var ifClone = $check.isArray( target ) && todo.tagName;
			
			var doName = name === 'append' ? '_sinAppend' : '_sinPrepend';
			
			$each( target,function( i,item ){
				var todoClone = ifClone ? todo.cloneNode(true) : todo;
				Raytin[ doName ]( item,todoClone );
			});
			
			if( ifClone ){
				// todo is existing node
				try{
					$removeNode( todo );
				}
				// todo is dynamic created
				catch(e){
					todo = null;
				}
			};
			
			return target;
		},
		_sinAppend : function( element,todo ){
			typeof todo === 'string' ? ( element.lastChild ? $after( element.lastChild,todo ) : $html( element,todo ) ) : element.appendChild( todo );
		},
		_sinPrepend : function( element,todo ){
			typeof todo === 'string' ? ( element.firstChild ? $before( element.firstChild,todo ) : $html( element,todo ) ) : element.insertBefore( todo,element.firstChild );
		},
		/*
		*  @ 向所有匹配的元素前面插入DOM
		*/
		$insertBefore : function( target,todo ){
			// single element
			if( target.tagName ){
				target.parentNode.insertBefore( todo,target );
				return target;
			};
			
			$each( target,function( i,item ){
				item.parentNode.insertBefore( todo.cloneNode(true),item );
			});
			
			// todo is existing node
			try{
				$removeNode( todo );
			}
			// todo is dynamic created
			catch(e){
				todo = null;
			};
			
			return target;
		},
		/*
		*  @ 向所有匹配的元素后面插入DOM
		*/
		$insertAfter : function( target,todo ){
			$each( target,function( i,item ){
				var index = $index( item ),
					par = item.parentNode,
					child = $children( par );
				index < child.length - 1 ? $insertBefore( $next(item),todo.cloneNode(true) ) : $append( par,todo.cloneNode(true) );
			});
			
			// todo is existing node
			try{
				$removeNode( todo );
			}
			// todo is dynamic created
			catch(e){
				todo = null;
			};
			
			return target;
		},
		/*
		*  @ 在匹配的元素前面（后面）插入一些HTML标记代码
		*/
		_insertHTML : function( element,todo,model ){
			if( typeof todo === 'string' ){
				var div = document.createElement('div');
				
				div.innerHTML = todo;
				
				$each( element,function( i,item ){
					var child = div.cloneNode(true).childNodes, // clone it
						len = child.length,
						parent = item.parentNode,
						nextNode = item.nextSibling;
						
					if( model === 'after' ){
						for( var j = 0 ; j < len ; j++ )
							nextNode ? parent.insertBefore( child[0],nextNode ) : parent.appendChild( child[0] );
					}
					else{
						for( var j = 0 ; j < len ; j++ )
							parent.insertBefore( child[0],item );
					};			
				});
				
				// release the memory
				div = null;
			};
		},
		/*
		*  @ 在匹配的元素前面插入一些HTML标记代码
		*/
		$before : function( element,todo ){
			Raytin._insertHTML( element,todo,'before' );
		},
		/*
		*  @ 在匹配的元素后面插入一些HTML标记代码
		*/
		$after : function( element,todo ){
			Raytin._insertHTML( element,todo,'after' );
		},
		/*
		*  @ 删除节点
		*/
		$removeNode : function( node ){
			$each( node,function( i,item ){
				var parent = $parent(item)[0];
				parent.removeChild( item );
			});
			return node;
		},
		/*
		*  @ 设置透明度
		*/
		$fadeTo : function( element,opacity ){
			$each( element,function( i,item ){
				if( item.style.opacity ){
					item.style.opacity = opacity;
				}
				else{
					item.style.filter = 'alpha(opacity=' + opacity + ')';
				};					
			});
		},
		/*
		*  @ 显示隐藏的匹配元素
		*/
		$show : function( element ){
			var inlineElement = /^span|a|b|strong|u|i|s|em|img|input|label|select|textarea$/;
			$each( element,function( i,item ){
				if( $css.get(item,'display') == 'none' ){
					item.style.display == 'none' ? $css.set( item,'display','' ) : $css.set( item,'display',inlineElement.test( item.tagName.toLowerCase() ) ? 'inline' : 'block' );
				};
			});
		},
		/*
		*  @ 隐藏匹配的元素
		*/
		$hide : function( element ){
			$each( element,function( i,item ){
				if( $css.get(item,'display') != 'none' ){
					item.style.display = 'none';
				};
			});
		},
		/*
		*  @ 淡入
		*/
		$fadeIn : function( element,speed,callback ){
			var step = typeof speed === 'undefined' ? 0.02 : 10 / speed, done = false;
			$each( element,function( i,item ){
				$show(item);
				var opa = parseFloat( $css.get(item,'opacity') );
				(function(){
					opa += step;
					$fadeTo( item,opa );
					if( opa < 1 ){
						setTimeout( arguments.callee,10 );
					}
					else{
						$fadeTo( item,1 );
						if( callback && !done ){
							done = true;
							callback.call(item);
						};
					};
				})();
			});
		},
		/*
		*  @ 淡出
		*/
		$fadeOut : function( element,speed,callback ){
			var step = typeof speed === 'undefined' ? 0.02 : 10 / speed, done = false;
			$each( element,function( i,item ){
				var opa = parseFloat( $css.get(item,'opacity') );
				(function(){
					opa -= step;
					$fadeTo( item,opa );
					if( opa > 0 ){
						setTimeout( arguments.callee,10 );
					}
					else{
						$fadeTo( item,0 );
						$hide(item);
						if( callback && !done ){
							done = true;
							callback.call(item);
						};
					};
				})();
			});
		},
		/*
		*  @ 把一个 名/值对 对象设置为所有匹配元素的样式属性
		*/
		$style : function( element,rules ){
			var arg = arguments;
			$each( element,arg.length < 3 ? function( i,item ){
					$each( rules,function( name,Ritem ){
						$css.set( item,name,Ritem );
					})
				}:
				function( i,item ){
					$css.set( item,arg[1],arg[2] );
				}
			);
			return element;
		},
		/*
		*  @ 获取元素的style中的property属性
		*/
		$getStyle : function( element,name ){
			return element.style[name];
		},
		/*
		*  @ 插入带样式信息的style标签
		*/
		$addStyleLabel : function( str ){
			if( !str ){ return };
			var style = document.createElement('style');
			style.setAttribute('type','text/css');
			if( style.styleSheet ){
				style.styleSheet.cssText = str;
			}
			// 万恶的IE不支持标准写法
			else{
				var text = document.createTextNode(str);
				style.appendChild(text);
				text = null;
			};
			var head = document.getElementsByTagName('head');
			head.length ? head[0].appendChild(style) : document.documentElement.appendChild(style);
			style = null;
		},
		/*
		*  @ 用一个或多个其他对象来扩展一个对象
		*/
		$extend : function( target,obj ){
			var arg = arguments, len = arg.length;
			if( !len ){ return };
			for( var i = 1 ; i < len ; i++ ){
				$each( arg[i],function( key,value ){
					target[key] = value;
				});
			};
			return target;
		},
		/*
		*  @ 获取文件内容
		*/
		$loadFile : function( url,callback ){
			var frame = document.createElement('iframe'),
				flag = true;
				
			// W3C
			frame.onload = function(){
				callback.call( this,this.contentWindow.document.documentElement );
				$removeNode( this );
			};
			
			// IE
			frame.onreadystatechange = function(){
				if( this.readyState === 'complete' || this.readyState === 'interactive' ){
					if( flag ){
						flag = false;
						callback.call( this,this.contentWindow.document.documentElement );
						$removeNode( this );
					};
				};
			};
			
			frame.src = url;
			frame.style.display = 'none';
			document.body.appendChild( frame );
			frame = null;
		},
		/*
		*  @ 获取event对象
		*/
		$getEvent : function( event ){
			return event ? event : window.event;
		},
		/*
		*  @ 获取事件目标
		*/
		$getTarget : function( event ){
			return event.target || event.srcElement;
		},
		/*
		*  @ 取消事件默认动作
		*/ 
		$preventDefault : function( event ){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = false;
			}
		},
		/*
		*  @ 阻止冒泡
		*/ 
		$stopPropagation : function( event ){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			}
		},
		/*
		*  @ 事件委派。给所有匹配的元素附加一个事件处理函数，即使这个元素是以后再添加进来的也有效。
		*/ 
		$live : function( expression,type,handler ){
			var liveList = expression.split(',');
			
			// 匹配
			var matching = function( str,target,ev ){
				var tagExp = new RegExp("^(" + rtag + ")$","i"),
					
					// 最多向上冒泡10级
					m = 10,
					
					// 冒泡查找 匹配方式
					Bubble = 'none';
				
				if( str.match( rid ) ){
					if( $attr.get( target,'id' ) !== RegExp.$1 ){
						Bubble = 'id';
					};
				}
				else if( str.match( rclass ) ){
					if( !new RegExp('\\b' + RegExp.$1 + '\\b','g').test( target.className ) ){
						Bubble = 'class';
					};
				}
				else if( str.match( tagExp ) ){
					if( target.tagName.toLowerCase() !== RegExp.$1 ){
						Bubble = 'tag';
					};
				}
				else{
					return;
				};
				
				// 作最后的努力，逐级向上查找
				if( Bubble !== 'none' ){
					var par = target;
					
					// 尝试向上查找
					for( par = par.parentNode ; par && m && ( Bubble == 'id' ? $attr.get( par,'id' ) !== RegExp.$1 : Bubble == 'class' ? !new RegExp('\\b' + RegExp.$1 + '\\b','g').test( par.className ) : par.tagName.toLowerCase() !== RegExp.$1 ) ; m-- );
					
					// 向上查找10级还是没找到，打道回府
					if( !m ) return;
					
					// 找到，重置this值
					target = par;
				};
						
				handler.call( target,ev );
				return true;
			};
			
			$event.add( $tag('body'),type,function(e){
				$each( liveList,function( i,item ){
					
					// 找到匹配时 立即中断
					if( matching( item,e.target,e ) ){
						return false;
					};
				});
			});
		},
		/*
		*  @ 在文档树加载完成后执行函数
		*/ 
		$DOMReady : function(){
			var exec,
				bindMode = document.addEventListener ? 'standard' : 'ie',
				_domReady = {
					done : false,
					fun : [],
					add : function(fn){
						if( !_domReady.done ){
							if( _domReady.fun.length == 0 ){
								_domReady.bind();
							};
							_domReady.fun.push(fn);
						}
						else{
							fn();
						};
					},
					bind : {
						standard : function(){
							document.addEventListener('DOMContentLoaded',_domReady.ready,false);
						},
						ie : function(){
							var done = false,
								init = function(){
									if( !done ){
										done = true;
										_domReady.ready();
									};
								};
								
							(function(){
								try{
									document.documentElement.doScroll('left');
								}catch(e){
									setTimeout(arguments.callee,20);
									return;
								};
								init();
							})();
							
							// 在文档树加载完成前始终尝试绑定
							document.onreadystatechange = function(){
								if( document.readyState == 'complete' ){
									document.onreadystatechange = null;
									init();
								};
							};
						}
					}[bindMode],
					unbind : {
						standard : function(){
							_domReady.fun = null;
							document.removeEventListener('DOMContentLoaded',_domReady.ready,false);
						},
						ie : function(){
							_domReady.fun = null;
						}
					}[bindMode],
					ready : function(){
						_domReady.done = true;
						while( exec = _domReady.fun.shift() ){
							exec();
						};
						_domReady.unbind();
					}
				};
			return _domReady.add;
		}(),
		/*
		*  @ 迭代器
		*/ 
	  	$each : function( stack,callback ){
			if( !stack ) return;
			
			// 如果stack为字符串 先尝试转换成DOM元素集合
			stack = typeof stack === 'string' ? $get(stack) : stack;
			var len = stack.length;
			
			if( stack.tagName ){
				callback.call( stack,0,stack );
				return;
			};
	  		if( len ){
	  			for( var i = 0 ; i < len ; i++ ){
	  				// return false to break off
					if( callback.call( stack[i],i,stack[i] ) === false ) break;
	  			};
	  		}
			else if( typeof len === 'undefined' ){
	  			for( var name in stack ){
	  				// return false to break off
					if( callback.call( stack[name],name,stack[name] ) === false ) break;
	  			};
	  		}
			else{
				return
			};
	  	}
	};
	
	// 如果 $ 符未被占用，则启用通过 $ 符快捷获取DOM对象
	if( typeof window.$ === 'undefined' ){
		Raytin['$'] = Raytin['$id'];
	};
	
/*
* ============ 样式操作 ============
*/ 
	Raytin.$css = {
		/*
		*  @ 获取CSS值
		*/
		get : function( element,pro ){
			if( element.style[pro] != '' ){
				return element.style[pro];
			};
			
			var el = element instanceof Array ? element[0] : element,
				curStyle = this.getComputedStyle(el),
				special = /^width|height|float|opacity$/;
				
			if( $browser.msie && special.test(pro) ){
	  			switch( pro ){
					case 'width' : return el.clientWidth + 'px';
					case 'height' : return el.clientHeight + 'px';
					case 'float' : pro = 'styleFloat'; return curStyle[pro];
					// IE don't support opacity
					case 'opacity' : 
						pro = 'filter';
						var curPro = curStyle[pro];
						return !curPro ? 1 : curPro.substring( curPro.indexOf('=') + 1 , curPro.indexOf(')') ) / 100;
				};
			};
			pro = pro === 'float' ? 'cssFloat' : pro;
			var forIE = /^medium|auto$/;
			// IE border
			if( forIE.test(curStyle[pro]) ){
				switch( curStyle[pro] ){
					case 'medium' : return '0px';
					case 'auto' : return '0px';
				};
			};
			return curStyle[pro];
		},
		/*
		*  @ 设置CSS值
		*/
		set : function( element,pro,val ){
			var special = /^float|opacity$/;
			if( typeof val == 'undefined' ){ return };
			// IE
			if( $browser.msie && special.test(pro) ){
				switch( pro ){
					case 'float' : pro = 'styleFloat';
					break;
					case 'opacity' : pro = 'filter'; val = 'alpha(opacity=' + val * 100 + ')';
					break;
				};
			};
			pro = pro === 'float' ? 'cssFloat' : pro;
			$each( element,function( i,item ){
				item.style[pro] = val;					
			});
			return element;
		},
		/*
		*  @ 取得元素对象的CSS样式声明对象
		*/
		getComputedStyle : function( element ){
			return document.defaultView ? document.defaultView.getComputedStyle(element,null) : element.currentStyle;
		}
	};
	
/*
* ============ 属性操作 ============
*/ 	
	Raytin.$attr = {
		/*
		*  @ 获取匹配元素的特性值
		*/
		get : function( element,name ){
			name = this._filtAttr( name );
			return element instanceof Array ? element[0].getAttribute( name ) : element.getAttribute( name );
		},
		/*
		*  @ 设置匹配元素的特性值
		*/
		set : function( element,name,value ){
			name = this._filtAttr( name );
			$each( element,function( i,item ){
				item.setAttribute( name,value );
			});
			return element;
		},
		/*
		*  @ 删除匹配元素的特性
		*/
		remove : function( element,name ){
			name = this._filtAttr( name );
			$each( element,function( i,item ){
				if( item.getAttribute( name ) ){
					item.removeAttribute( name );
				};
			});
			return element;
		},
		_filtAttr : function( name ){
			// IE6、7
			if( name === 'class' ){
				var div = document.createElement("div");
				div.setAttribute("class","test");
				name = div.className === 'test' ? name : 'className';
				div = null;
			};
			return name;
		}
	};

/*
* ============ data ============
*/ 
	Raytin.$data = {
		/*
		*  @ 在元素上存放数据
		*/ 
		get : function( element,name ){
			var el = $get(element)[0];
			return el.stor ? el.stor[name] : undefined;
		},
		/*
		*  @ 设置在元素上存放的数据
		*/ 
		set : function( element,name,value ){
			var el = $get(element)[0];
			el.stor = el.stor || {};
			el.stor[name] = value;
			return el.stor;
		},
		/*
		*  @ 删除在元素上存放的数据
		*/ 
		remove : function( element,name ){
			var el = $get(element)[0];
			el.stor = el.stor || {};
			delete el.stor[name];
			return el.stor;
		}
	};
/*
* ============ event ============
*/ 
	Raytin.$event = {
		/*
		*  @ 为每个匹配元素的特定事件绑定事件处理函数
		*/ 
		add : function( element,type,handler ){
			if( typeof handler == 'function' ){
				$each( element,function( i,item ){
					$event._addHandler( item,type,handler );
				});
				return this;
			};
		},
		_addHandler : function( element,type,handler ){
			// 绑定前先将事件句柄添加进arrayList
			var pro = '_' + type;
			if( !$data.get( element,pro ) ){
				// if not exist , create it
				$data.set( element,pro,[] );
			};
			var handlerList = $data.get( element,pro );
			handlerList.push( handler );
			
			// bind
			if( document.addEventListener ){
				element.addEventListener( type,handler,false );
			}
			else if( document.attachEvent ){
				var trueHandler = function( e,hand ){
	  				if( !e ) e = window.event;
	  				
					// reset the event Object
					var _event = {
	  					type : e.type,
	  					target : e.srcElement,
	  					currentTarget : element,
	  					relatedTarget : e.fromElement ? e.fromElement : e.toElement,
	  					eventPhase : e.srcElement == element ? 2 : 3,
	  					clientX : e.clientX,
	  					clientY : e.clientY,
	  					screenX : e.screenX,
	  					screenY : e.screenY,
	  					charCode : e.keyCode,
	  					ctrlKey : e.ctrlKey,
	  					altKey : e.altKey,
	  					shiftKey : e.shiftKey,
	  					stopPropagation : function(){
	  						e.cancelBubble = true;
	  					},
	  					preventDefault : function(){
	  						e.returnValue = false;
	  					}
	  				};
					hand.call( element,_event );
				};
				element['on' + type] = function(){
					for( var i = 0 ,len = handlerList.length ; i < len ; i++ ){
						trueHandler( event,handlerList[i] );
					};
				};
			};
		},
		/*
		*  @ 从每一个匹配的元素中删除绑定的事件
		*/ 
		remove : function( element,type,handler ){
			var pro = '_' + type;
			
			// unbind single event
			if( typeof handler != 'undefined' ){
				$each( element,function( i,item ){
					$event._removeHandler( item,type,handler );
				});
			}
			// unbind a particular type of event
			else{
				$each( element,function( i,item ){
					var handlerList = $data.get( item,pro );
					if( handlerList && handlerList.length ){
						item.removeEventListener ? 
						$each( handlerList,function( j,jtem ){
							$event._removeHandler( item,type,jtem );
						}):
						handlerList = null;
					};
				});
			};
			return this;
		},
		_removeHandler : function( element,type,handler ){
			// 同时删除元素对象上储存的处理函数
			var pro = '_' + type,
				handlerList = $data.get( element,pro );

			if( handlerList ){
				$arr.remove( handlerList,handler );
			};
			
			if( element.removeEventListener ){
				element.removeEventListener( type,handler,false );
			};
		},
		/*
		*  @ 在每一个匹配的元素上触发某类事件
		*/ 
		trigger : function( element,type,args ){
			var isArg = typeof args !== 'undefined' && args instanceof Array;
			$each( element,function( i,item ){
				var pro = '_' + type,
					list = $data.get( item,pro );
				
				if( list && list.length ){
					$each( list,function( j,jtem ){
						isArg ? jtem.apply( item,args ) : jtem.call( item );
					});
				};
			});
			return this;
		},
		/*
		*  @ 点击后依次调用函数
		*/ 
		toggle : function( element ){
			var args = Array.prototype.slice.call( arguments ),
				len = args.length;
			
			args.shift();
			if( len < 3 ){ return };

			$each( element,function( i,item ){
				var i = 0;
				$event.add( item,'click',function(e){
					var fn = args[i++] || args[ i=0,i++ ];
					fn.call(item,e);
				});
			});
			return this;
		},
		/*
		*  @ 鼠标悬停切换
		*/ 
		hover : function( element,hoverIn,hoverOut ){
			$each( element,function( i,item ){
				$event.add( item,'mouseover',hoverIn ).add( item,'mouseout',hoverOut );
			});
			return this;
		}
	};
	
	// 事件快捷
	'click,change,blur,focus,keydown,keypress,keyup,mousedown,mouseover,mouseout,mouseup,resize,select,submit,unload'.replace( /[^,]+/g,function( type ){
		window['$' + type] = function( element,handler ){
			Raytin.$event.add( element,type,handler )
		};
	});

/*
* ============ animate ============
*/ 
	Raytin.$animate = function( element,config,time,easing,callback ){
		// 算法规则 t:开始时间 , b:初始值 , c:变化值 , d:持续时间
		var Tween = window.$tween ? $tween : {
			Quad: {
				easeIn: function(t, b, c, d) {
					return c * (t /= d) * t + b;
				},
				easeOut: function(t, b, c, d) {
					return - c * (t /= d) * (t - 2) + b;
				},
				easeInOut: function(t, b, c, d) {
					if ((t /= d / 2) < 1) return c / 2 * t * t + b;
					return - c / 2 * ((--t) * (t - 2) - 1) + b;
				}
			}
		};
		
		var tween = ['Quad','easeOut'];
		//easing = typeof easing === 'undefined' ? 'Quad:easeOut' : easing;
		
		if( arguments.length == 4 && typeof arguments[3] === 'function' ){
			callback = easing;
		}
		else if( arguments.length == 5 && typeof arguments[3] == 'string' ){
			tween = easing.split(/\s*:\s*/);
			if( !Tween[ tween[0] ] ){
				return;
			};
		};
		
		var k_animate_flag = false,
			_animate = function( element,key,val ){
				var s = new Date().getTime(),
					b = parseFloat( $css.get(element,key) ),
					c = val - b,
					d = time;
				(function(){
					var t = new Date().getTime() - s;
					if( t < d ){
						element.style[key] = Tween[ tween[0] ][ tween[1] ](t,b,c,d) + 'px';
						setTimeout(arguments.callee,10);
					}else{
						element.style[key] = val + 'px';
						if( callback ){
							if( !k_animate_flag ){ callback.call( element ) };
							k_animate_flag = true;
						};
					};
				})();
			};
		
		$each( element,function( i,item ){
			for( var p in config ){
				_animate( item,p,parseFloat(config[p]) );
			};
		});
		
	};
/*
* ============ 类型检测 ============
*/ 
	Raytin.$check = {
		/* @ 对象检测 */
		isObject : function(obj){
			return obj instanceof Object;
		},
		/* @ 函数检测 */
		isFunction : function(obj){
			return obj.constructor == Function;
		},
		/* @ 数组检测 */
		isArray : function(obj){
			return obj.constructor == Array;
		},
		/* @ 数字型检测 */
		isNumber : function(obj){
			return typeof obj == 'number';
		},
		/* @ 字符串检测 */
		isString : function(obj){
			return typeof obj == 'string';
		},
		/* @ 布尔型检测 */
		isBoolean : function(obj){
			return typeof obj == 'boolean';
		},
		/* @ 空对象检测 */
		isEmpty : function(obj){
			for(var name in obj){
				return false;
			};
			return true;
		},
		/* @ 定义检测 */
		isDefined : function(obj){
			return typeof obj !== 'undefined';
		},
		/* @ Date对象检测 */
		isDate : function(obj){
			return obj instanceof Date;
		}
	};
/*
* ============ 浏览器检测 ============
*/ 
	Raytin.$browser = {
		version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1], 
		safari: /(webkit)[ \/]([\w.]+)/.test( userAgent ), 
		opera: /(opera)(?:.*version)?[ \/]([\w.]+)/.test( userAgent ), 
		msie:  /(msie) ([\w.]+)/.test( userAgent ) && !/opera/.test( userAgent ), 
		mozilla: /(mozilla)(?:.*? rv:([\w.]+))?/.test(userAgent)&&!/(compatible|webkit)/.test(userAgent)
	};
/*
* ============ cookie获取、设置 ============
*/ 
	Raytin.$cookie = function( name,value,config ){
		// set cookie
		if( typeof value !== 'undefined' ){
			config = config || {};
			
			// 如果value值为null,清除这个cookie
			if( value === null ){
				value = '';
				config.expires = new Date(0);
			}
			// 过期时间默认为1天
			else{
				config.expires = 1;
			};
			var expires;
			if( typeof config.expires === 'number' || config.expires.toUTCString ){
				if( typeof config.expires === 'number' ){
					var date = new Date();
					expires = date.setTime( date.getTime() + config.expires * 86400000 );
				}
				else{
					expires = config.expires.toUTCString();
				};
				expires = '; expires=' + expires;
			};
			var path = config.path ? '; path=' + config.path : '',
				domain = config.domain ? '; domain=' + config.domain : '',
				secure = config.secure ? '; secure' : '';
			document.cookie = [ name,'=',encodeURIComponent(value),expires,path,domain,secure ].join('');
		}
		// get cookie
		else{
			var cookies = document.cookie.split(';'), cookieValue = null;
			if( cookies && cookies.length ){
				for( var i = 0 , len = cookies.length ; i < len ; i++ ){
					var cookie = $str.trim( cookies[i] );
					// abcd != abc
					if( cookie.substr( 0,name.length + 1 ) === ( name + '=' ) ){
						cookieValue = decodeURIComponent( cookie.substr(name.length + 1) );
					};
				};
			};
			return cookieValue;
		};
	};
/*
* ============ 子cookie获取、设置 ============
*/ 
	Raytin.$subCookie = function( name,subName,subValue,config ){
		var cookie = $cookie( name );
		
		// 父辈cookie不存在
		if( !cookie ){
			return typeof subValue !== 'undefined' ? $cookie( name,subName + '=' + subValue,config ) : null;
		};
		
		var	args = arguments,
			subCookies = {},
			subCookieArr = cookie.split('&');
			
		if( subCookieArr && subCookieArr.length ){
			for( var i = 0 , len = subCookieArr.length ; i < len ; i++ ){
				var subNameVal = subCookieArr[i].split('=');
				subCookies[ subNameVal[0] ] = subNameVal[1];
			};
			// set subCookie
			if( typeof subValue !== 'undefined' ){
				var tempArr = [];
				
				// delete subCookie
				if( subValue == null ){
					delete subCookies[subName];
				}
				else{
					subCookies[subName] = subValue;
				};
				
				for( var key in subCookies ){
					tempArr.push( key + '=' + subCookies[key] );
				};
				$cookie( name,tempArr.join('&'),config );
			}
			// get subCookie
			else{
				return subCookies[subName] ? subCookies[subName] : null;
			};
		};
	};
/*
* ============ Ajax ============
*/ 
	Raytin.$ajax = function(){
		var xhr;
		var _ajax = {
			// 创建XHR对象 
			getXHR : function(){
				if( typeof XMLHttpRequest != 'undefined' ){
					return new XMLHttpRequest();
				}
				else if( typeof ActiveXObject != 'undefined' ){
					if( typeof arguments.callee.ActiveXString != "string" ){
						var version = ["MSXML2.XMLHttp.6.0","MSXML2.XMLHttp.3.0","MSXML2.XMLHttp"];
						for( var i = 0 , len = version.length ; i < len; i++ ){
							try{
								var xhr	= new ActiveXObject(version[i]);
								arguments.callee.ActiveXString = version[i];
								return xhr;
							}catch( er ){}
						};
					}
					return new ActiveXObject(arguments.callee.ActiveXString);
				}
				else{
					throw new Error("您的浏览器不支持XHR.");
				}
			}(),
			_data : {
				type : 'get',
				url : null,
				async : true,
				data : null,
				dataType : 'html',
				success : null,
				error : null
			},
			stateChange : function(){
				if( xhr.readyState == 4 && ( xhr.status == 200 || xhr.status == 304 ) ){
					if( _ajax._data.success ){
						_ajax._data.success( xhr.responseText );
					};
				}
				else{
					if( _ajax._data.error ){
						_ajax._data.error( xhr.responseText );
					};
				};
			},
			ready : function( option ){
				var opt = $extend( _ajax._data,option );
				xhr = _ajax.getXHR;
				xhr.onreadystatechange = _ajax.stateChange();
				xhr.open( opt.type,opt.url,opt.async );
				xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
				xhr.send( opt.data );
			}
		};
		return _ajax.ready;
	}();
	
/*
* ============ 字符串扩展 ============
*/ 
	Raytin.$str = {
		/*
		*  @ 清除头尾空格
		*/ 
		trim : function( str ){
			return str.replace(/^\s*(.*?)\s*$/g,"$1");
		}
	};
/*
* ============ 数组扩展 ============
*/ 
	Raytin.$arr = {	
		/*
		*  @ 删除拥有指定值的项(支持多项)
		*/ 
		remove : function( arr,value ){
			var self = arr;
			//若无参数，则不做操作
			if( arguments.length <= 1 ){ return self };
			for( var i = 1 , len = arguments.length ; i < len ; i++ ){
				var a = arguments[i];
				for( var j = 0 , leng = self.length ; j < leng ; j++ ){
					var b = self[j];
					if( a == b ) self.splice(j,1);
				};
			}
			return self;
		},
		/*
		*  @ 去除数组重复值
		*/ 
		unique : function( arr ){
			var obj = {},
				len = arr.length;
				
			if( len < 2 ){ return arr };
			
			for( var i = 0 ; i < len ; i++ ){
				var cur = arr[i];
				!obj[cur] && ( obj[cur] = true );
			};
			
			arr.length = 0;
			
			for( var name in obj ){
				arr[arr.length] = name;
			};
			
			return arr;
		},
		/*
		*  @ 将一个数组中的元素转换到另一个数组中
		*/ 
		map : function( arr,callback ){
			var tempArr = [];
			
			for( var i = 0 , len = arr.length ; i < len ; i++ ){
				var cur = arr[i],
					done = callback.call( cur,cur );
				done instanceof Array ? tempArr = tempArr.concat(done) : tempArr.push(done);
			};
			
			return tempArr;
		},
		/*
		*  @ 将类数组对象转换为数组对象
		*/
		makeArray : function( arr ){
			if( arr.item || ( typeof arr.length != 'undefined' && !$check.isArray(arr) ) ){
				var temp = [];
				
				for( var i = 0 , len = arr.length ; i < len ; i++ ){
					temp.push( arr[i] );
				};
				
				return temp;
			};
			return arr;
		},
		/*
		*  @ 确定第一个参数在数组中的位置，从0开始计数(如果没有找到则返回 -1)
		*/
		inArray : function( element,arr ){
			for( var i = 0 , len = arr.length ; i < len ; i++ ){
				// window == document in IE
				if( element === arr[i] ){
					return i;
				};
			};
			return -1;
		},
		/*
		*  @ 二分查找(仅针对排序后的数组，大数据量时很有用)
		*/
		binarySearch : function( arr,value ){
			var left = 0,
				right = arr.length,
				center = 0; 
			while( left <= right ){ 
				center = Math.floor( ( left + right ) / 2 ); 
				value < arr[center] ? right = center - 1 : left = center + 1;
			};
			//未找到值时返回-1
			return arr[center] == value ? center : -1;
		}
	};
/*
* ============ 继承 ============
*/ 
	Raytin.$inherit = {
		/*
		*  @ 原型继承 - 函数
		*  参数说明：（继承目标，子对象）
		*  Tip：前置操作
		*/ 
		proto : function( parent,child ){
			var F = function(){};
			F.prototype = parent.prototype;
			child.prototype = new F();
			child.prototype.constructor = child;
		},
		/*
		*  @ 拷贝继承 - 函数
		*  参数说明：（继承目标，子对象）
		*/ 
		copy : function( parent,child ){
			var p = parent.prototype,
				c = child.prototype;
			for( var i in p ){
				c[i] = p[i];
			};
		},
		/*
		*  @ 深度拷贝 - 对象
		*  参数说明：继承目标
		*/ 
		deepCopy : function( p,c ){
			var c = c || {};
			for( var i in p ){
				if( typeof p[i] === 'object' ){
					c[i] = p[i].constructor == Array ? [] : {};
					arguments.callee( p[i],c[i] );
				}
				else{
					c[i] = p[i];
				};
			};
			return c;
		}
	};
	
	// register
	for( var pro in Raytin ){
		if( pro.charAt(0) == '$' ){
			window[pro] = Raytin[pro];
		};
	};
})(window);
/*
[2012.8.30] 增加$快捷获取ID元素。
[2012.8.30] $each方法优化，返回false中断循环。
[2012.8.31] 优化$before和$after。
[2012.9.01] 优化增强$before,$after,$prev,$prevAll,$next,$nextAll。 
[2012.9.01] 增加事件委派方法$live，数组方法inArray。
[2012.9.04] 增强$append,$prepend
[2012.9.10] 优化$offset方法，增加$position获取相对父辈的位置
*/