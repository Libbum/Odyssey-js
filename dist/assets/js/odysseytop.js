!function(o){var t=null;o.modal=function(e,i){o.modal.close();var s,l;if(this.$body=o("body"),this.options=o.extend({},o.modal.defaults,i),this.options.doFade=!isNaN(parseInt(this.options.fadeDuration,10)),e.is("a"))if(l=e.attr("href"),/^#/.test(l)){if(this.$elm=o(l),1!==this.$elm.length)return null;this.$body.append(this.$elm),this.open()}else this.$elm=o("<div>"),this.$body.append(this.$elm),s=function(o,t){t.elm.remove()},this.showSpinner(),e.trigger(o.modal.AJAX_SEND),o.get(l).done(function(i){t&&(e.trigger(o.modal.AJAX_SUCCESS),t.$elm.empty().append(i).on(o.modal.CLOSE,s),t.hideSpinner(),t.open(),e.trigger(o.modal.AJAX_COMPLETE))}).fail(function(){e.trigger(o.modal.AJAX_FAIL),t.hideSpinner(),e.trigger(o.modal.AJAX_COMPLETE)});else this.$elm=e,this.$body.append(this.$elm),this.open()},o.modal.prototype={constructor:o.modal,open:function(){var t=this;this.options.doFade?(this.block(),setTimeout(function(){t.show()},this.options.fadeDuration*this.options.fadeDelay)):(this.block(),this.show()),this.options.escapeClose&&o(document).on("keydown.modal",function(t){27==t.which&&o.modal.close()}),this.options.clickClose&&this.blocker.click(function(t){t.target==this&&o.modal.close()})},close:function(){this.unblock(),this.hide(),o(document).off("keydown.modal")},block:function(){this.$elm.trigger(o.modal.BEFORE_BLOCK,[this._ctx()]),this.blocker=o('<div class="jquery-modal blocker"></div>'),this.$body.css("overflow","hidden"),this.$body.append(this.blocker),this.options.doFade&&this.blocker.css("opacity",0).animate({opacity:1},this.options.fadeDuration),this.$elm.trigger(o.modal.BLOCK,[this._ctx()])},unblock:function(){if(this.options.doFade){var o=this;this.blocker.fadeOut(this.options.fadeDuration,function(){o.blocker.children().appendTo(o.$body),o.blocker.remove(),o.$body.css("overflow","")})}else this.blocker.children().appendTo(this.$body),this.blocker.remove(),this.$body.css("overflow","")},show:function(){this.$elm.trigger(o.modal.BEFORE_OPEN,[this._ctx()]),this.options.showClose&&(this.closeButton=o('<a href="#close-modal" rel="modal:close" class="close-modal '+this.options.closeClass+'">'+this.options.closeText+"</a>"),this.$elm.append(this.closeButton)),this.$elm.addClass(this.options.modalClass+" current"),this.$elm.appendTo(this.blocker),this.options.doFade?this.$elm.css("opacity",0).show().animate({opacity:1},this.options.fadeDuration):this.$elm.show(),this.$elm.trigger(o.modal.OPEN,[this._ctx()])},hide:function(){this.$elm.trigger(o.modal.BEFORE_CLOSE,[this._ctx()]),this.closeButton&&this.closeButton.remove(),this.$elm.removeClass("current");var t=this;this.options.doFade?this.$elm.fadeOut(this.options.fadeDuration,function(){t.$elm.trigger(o.modal.AFTER_CLOSE,[t._ctx()])}):this.$elm.hide(0,function(){t.$elm.trigger(o.modal.AFTER_CLOSE,[t._ctx()])}),this.$elm.trigger(o.modal.CLOSE,[this._ctx()])},showSpinner:function(){this.options.showSpinner&&(this.spinner=this.spinner||o('<div class="'+this.options.modalClass+'-spinner"></div>').append(this.options.spinnerHtml),this.$body.append(this.spinner),this.spinner.show())},hideSpinner:function(){this.spinner&&this.spinner.remove()},_ctx:function(){return{elm:this.$elm,blocker:this.blocker,options:this.options}}},o.modal.close=function(o){if(t){o&&o.preventDefault(),t.close();var e=t.$elm;return t=null,e}},o.modal.isActive=function(){return!!t},o.modal.defaults={escapeClose:!0,clickClose:!0,closeText:"Close",closeClass:"",modalClass:"modal",spinnerHtml:null,showSpinner:!0,showClose:!0,fadeDuration:null,fadeDelay:1},o.modal.BEFORE_BLOCK="modal:before-block",o.modal.BLOCK="modal:block",o.modal.BEFORE_OPEN="modal:before-open",o.modal.OPEN="modal:open",o.modal.BEFORE_CLOSE="modal:before-close",o.modal.CLOSE="modal:close",o.modal.AFTER_CLOSE="modal:after-close",o.modal.AJAX_SEND="modal:ajax:send",o.modal.AJAX_SUCCESS="modal:ajax:success",o.modal.AJAX_FAIL="modal:ajax:fail",o.modal.AJAX_COMPLETE="modal:ajax:complete",o.fn.modal=function(e){return 1===this.length&&(t=new o.modal(this,e)),this},o(document).on("click.modal",'a[rel="modal:close"]',o.modal.close),o(document).on("click.modal",'a[rel="modal:open"]',function(t){t.preventDefault(),o(this).modal()})}(jQuery);
!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t,e){function o(t){function e(t){i?(o(),V(e),n=!0,i=!1):n=!1}var o=t,i=!1,n=!1;this.kick=function(t){i=!0,n||e()},this.end=function(t){var e=o;t&&(n?(o=i?function(){e(),t()}:t,i=!0):t())}}function i(){return!0}function n(){return!1}function r(t){t.preventDefault()}function s(t){D[t.target.tagName.toLowerCase()]||t.preventDefault()}function a(t){return 1===t.which&&!t.ctrlKey&&!t.altKey}function h(t,e){var o,i;if(t.identifiedTouch)return t.identifiedTouch(e);for(o=-1,i=t.length;++o<i;)if(t[o].identifier===e)return t[o]}function u(t,e){var o=h(t.changedTouches,e.identifier);if(o&&(o.pageX!==e.pageX||o.pageY!==e.pageY))return o}function c(t){var e;a(t)&&(e={target:t.target,startX:t.pageX,startY:t.pageY,timeStamp:t.timeStamp},O(document,j.move,l,e),O(document,j.cancel,p,e))}function l(t){var e=t.data;_(t,e,t,d)}function p(t){d()}function d(){R(document,j.move,l),R(document,j.cancel,p)}function f(t){var e,o;D[t.target.tagName.toLowerCase()]||(e=t.changedTouches[0],o={target:e.target,startX:e.pageX,startY:e.pageY,timeStamp:t.timeStamp,identifier:e.identifier},O(document,F.move+"."+e.identifier,m,o),O(document,F.cancel+"."+e.identifier,v,o))}function m(t){var e=t.data,o=u(t,e);o&&_(t,e,o,w)}function v(t){var e=t.data,o=h(t.changedTouches,e.identifier);o&&w(e.identifier)}function w(t){R(document,"."+t,m),R(document,"."+t,v)}function _(t,e,o,i){var n=o.pageX-e.startX,r=o.pageY-e.startY;E*E>n*n+r*r||z(t,e,o,n,r,i)}function g(){return this._handled=i,!1}function y(t){t._handled()}function z(t,e,o,i,n,r){var s,a;e.target;s=t.targetTouches,a=t.timeStamp-e.timeStamp,e.type="movestart",e.distX=i,e.distY=n,e.deltaX=i,e.deltaY=n,e.pageX=o.pageX,e.pageY=o.pageY,e.velocityX=i/a,e.velocityY=n/a,e.targetTouches=s,e.finger=s?s.length:1,e._handled=g,e._preventTouchmoveDefault=function(){t.preventDefault()},L(e.target,e),r(e.identifier)}function k(t){var e=t.data.timer;t.data.touch=t,t.data.timeStamp=t.timeStamp,e.kick()}function b(t){var e=t.data.event,o=t.data.timer;Y(),C(e,o,function(){setTimeout(function(){R(e.target,"click",n)},0)})}function Y(t){R(document,j.move,k),R(document,j.end,b)}function X(t){var e=t.data.event,o=t.data.timer,i=u(t,e);i&&(t.preventDefault(),e.targetTouches=t.targetTouches,t.data.touch=i,t.data.timeStamp=t.timeStamp,o.kick())}function x(t){var e=t.data.event,o=t.data.timer,i=h(t.changedTouches,e.identifier);i&&(A(e),C(e,o))}function A(t){R(document,"."+t.identifier,X),R(document,"."+t.identifier,x)}function T(t,e,o,i){var n=o-t.timeStamp;t.type="move",t.distX=e.pageX-t.startX,t.distY=e.pageY-t.startY,t.deltaX=e.pageX-t.pageX,t.deltaY=e.pageY-t.pageY,t.velocityX=.3*t.velocityX+.7*t.deltaX/n,t.velocityY=.3*t.velocityY+.7*t.deltaY/n,t.pageX=e.pageX,t.pageY=e.pageY}function C(t,e,o){e.end(function(){return t.type="moveend",L(t.target,t),o&&o()})}function P(t,e,o){return O(this,"movestart.move",y),!0}function $(t){return R(this,"dragstart drag",r),R(this,"mousedown touchstart",s),R(this,"movestart",y),!0}function I(t){"move"!==t.namespace&&"moveend"!==t.namespace&&(O(this,"dragstart."+t.guid+" drag."+t.guid,r,e,t.selector),O(this,"mousedown."+t.guid,s,e,t.selector))}function S(t){"move"!==t.namespace&&"moveend"!==t.namespace&&(R(this,"dragstart."+t.guid+" drag."+t.guid),R(this,"mousedown."+t.guid))}var E=6,O=t.event.add,R=t.event.remove,L=function(e,o,i){t.event.trigger(o,i,e)},V=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t,e){return window.setTimeout(function(){t()},25)}}(),D={textarea:!0,input:!0,select:!0,button:!0},j={move:"mousemove",cancel:"mouseup dragstart",end:"mouseup"},F={move:"touchmove",cancel:"touchend",end:"touchend"};t.event.special.movestart={setup:P,teardown:$,add:I,remove:S,_default:function(t){function i(e){T(r,s.touch,s.timeStamp),L(t.target,r)}var r,s;t._handled()&&(r={target:t.target,startX:t.startX,startY:t.startY,pageX:t.pageX,pageY:t.pageY,distX:t.distX,distY:t.distY,deltaX:t.deltaX,deltaY:t.deltaY,velocityX:t.velocityX,velocityY:t.velocityY,timeStamp:t.timeStamp,identifier:t.identifier,targetTouches:t.targetTouches,finger:t.finger},s={event:r,timer:new o(i),touch:e,timeStamp:e},t.identifier===e?(O(t.target,"click",n),O(document,j.move,k,s),O(document,j.end,b,s)):(t._preventTouchmoveDefault(),O(document,F.move+"."+t.identifier,X,s),O(document,F.end+"."+t.identifier,x,s)))}},t.event.special.move={setup:function(){O(this,"movestart.move",t.noop)},teardown:function(){R(this,"movestart.move",t.noop)}},t.event.special.moveend={setup:function(){O(this,"movestart.moveend",t.noop)},teardown:function(){R(this,"movestart.moveend",t.noop)}},O(document,"mousedown.move",c),O(document,"touchstart.move",f),"function"==typeof Array.prototype.indexOf&&!function(t,e){for(var o=["changedTouches","targetTouches"],i=o.length;i--;)-1===t.event.props.indexOf(o[i])&&t.event.props.push(o[i])}(t)}),function(t){"function"==typeof define&&define.amd?define(["jquery"],t):t(jQuery)}(function(t,e){function o(t){var e,o,i;e=t.currentTarget.offsetWidth,o=t.currentTarget.offsetHeight,i={distX:t.distX,distY:t.distY,velocityX:t.velocityX,velocityY:t.velocityY,finger:t.finger},t.distX>t.distY?t.distX>-t.distY?(t.distX/e>a.threshold||t.velocityX*t.distX/e*a.sensitivity>1)&&(i.type="swiperight",s(t.currentTarget,i)):(-t.distY/o>a.threshold||t.velocityY*t.distY/e*a.sensitivity>1)&&(i.type="swipeup",s(t.currentTarget,i)):t.distX>-t.distY?(t.distY/o>a.threshold||t.velocityY*t.distY/e*a.sensitivity>1)&&(i.type="swipedown",s(t.currentTarget,i)):(-t.distX/e>a.threshold||t.velocityX*t.distX/e*a.sensitivity>1)&&(i.type="swipeleft",s(t.currentTarget,i))}function i(e){var o=t.data(e,"event_swipe");return o||(o={count:0},t.data(e,"event_swipe",o)),o}var n=t.event.add,r=t.event.remove,s=function(e,o,i){t.event.trigger(o,i,e)},a={threshold:.4,sensitivity:6};t.event.special.swipe=t.event.special.swipeleft=t.event.special.swiperight=t.event.special.swipeup=t.event.special.swipedown={setup:function(t,e,r){var t=i(this);if(!(t.count++>0))return n(this,"moveend",o),!0},teardown:function(){var t=i(this);if(!(--t.count>0))return r(this,"moveend",o),!0},settings:a}}),function(t){function e(t,e){for(var o=t.length;o--;)if(t[o]===e)return o;return-1}function o(t,e){if(t.length!=e.length)return!1;for(var o=0;o<t.length;o++)if(t[o]!==e[o])return!1;return!0}function i(t){for(g in z)z[g]=t[A[g]]}function n(t){var o,n,r,s,h,u;if(o=t.keyCode,-1==e(x,o)&&x.push(o),93!=o&&224!=o||(o=91),o in z){z[o]=!0;for(r in b)b[r]==o&&(a[r]=!0)}else if(i(t),a.filter.call(this,t)&&o in y)for(u=d(),s=0;s<y[o].length;s++)if(n=y[o][s],n.scope==u||"all"==n.scope){h=n.mods.length>0;for(r in z)(!z[r]&&e(n.mods,+r)>-1||z[r]&&-1==e(n.mods,+r))&&(h=!1);(0!=n.mods.length||z[16]||z[18]||z[17]||z[91])&&!h||n.method(t,n)===!1&&(t.preventDefault?t.preventDefault():t.returnValue=!1,t.stopPropagation&&t.stopPropagation(),t.cancelBubble&&(t.cancelBubble=!0))}}function r(t){var o,i=t.keyCode,n=e(x,i);if(n>=0&&x.splice(n,1),93!=i&&224!=i||(i=91),i in z){z[i]=!1;for(o in b)b[o]==i&&(a[o]=!1)}}function s(){for(g in z)z[g]=!1;for(g in b)a[g]=!1}function a(t,e,o){var i,n;i=m(t),void 0===o&&(o=e,e="all");for(var r=0;r<i.length;r++)n=[],t=i[r].split("+"),t.length>1&&(n=v(t),t=[t[t.length-1]]),t=t[0],t=X(t),t in y||(y[t]=[]),y[t].push({shortcut:i[r],scope:e,method:o,key:i[r],mods:n})}function h(t,e){var i,n,r,s,a,h=[];for(i=m(t),s=0;s<i.length;s++){if(n=i[s].split("+"),n.length>1&&(h=v(n)),t=n[n.length-1],t=X(t),void 0===e&&(e=d()),!y[t])return;for(r=0;r<y[t].length;r++)a=y[t][r],a.scope===e&&o(a.mods,h)&&(y[t][r]={})}}function u(t){return"string"==typeof t&&(t=X(t)),-1!=e(x,t)}function c(){return x.slice(0)}function l(t){var e=(t.target||t.srcElement).tagName;return!("INPUT"==e||"SELECT"==e||"TEXTAREA"==e)}function p(t){k=t||"all"}function d(){return k||"all"}function f(t){var e,o,i;for(e in y)for(o=y[e],i=0;i<o.length;)o[i].scope===t?o.splice(i,1):i++}function m(t){var e;return t=t.replace(/\s/g,""),e=t.split(","),""==e[e.length-1]&&(e[e.length-2]+=","),e}function v(t){for(var e=t.slice(0,t.length-1),o=0;o<e.length;o++)e[o]=b[e[o]];return e}function w(t,e,o){t.addEventListener?t.addEventListener(e,o,!1):t.attachEvent&&t.attachEvent("on"+e,function(){o(window.event)})}function _(){var e=t.key;return t.key=T,e}var g,y={},z={16:!1,18:!1,17:!1,91:!1},k="all",b={"⇧":16,shift:16,"⌥":18,alt:18,option:18,"⌃":17,ctrl:17,control:17,"⌘":91,command:91},Y={backspace:8,tab:9,clear:12,enter:13,"return":13,esc:27,escape:27,space:32,left:37,up:38,right:39,down:40,del:46,"delete":46,home:36,end:35,pageup:33,pagedown:34,",":188,".":190,"/":191,"`":192,"-":189,"=":187,";":186,"'":222,"[":219,"]":221,"\\":220},X=function(t){return Y[t]||t.toUpperCase().charCodeAt(0)},x=[];for(g=1;20>g;g++)Y["f"+g]=111+g;var A={16:"shiftKey",18:"altKey",17:"ctrlKey",91:"metaKey"};for(g in b)a[g]=!1;w(document,"keydown",function(t){n(t)}),w(document,"keyup",r),w(window,"focus",s);var T=t.key;t.key=a,t.key.setScope=p,t.key.getScope=d,t.key.deleteScope=f,t.key.filter=l,t.key.isPressed=u,t.key.getPressedKeyCodes=c,t.key.noConflict=_,t.key.unbind=h,"undefined"!=typeof module&&(module.exports=a)}(this);var ArrayProto,nativeForEach,nativeIsArray,nativeMap,nativeReduce,__hasProp={}.hasOwnProperty;"undefined"!=typeof _&&null!==_||(this._={},ArrayProto=Array.prototype,nativeForEach=ArrayProto.forEach,nativeMap=ArrayProto.map,nativeReduce=ArrayProto.reduce,nativeIsArray=Array.isArray,_.isObject=function(t){var e;return e=typeof t,"function"===e||"object"===e&&!!t},_.after=function(t,e){return function(){return--t<1?e.apply(this,arguments):void 0}},_.each=function(t,e,o){var i,n,r,s,a,h;try{if(nativeForEach&&t.forEach===nativeForEach)t.forEach(e,o);else if(_.isNumber(t.length))for(n=a=0,h=t.length;h>=0?h>a:a>h;n=h>=0?++a:--a)e.call(o,t[n],n,t);else for(r in t)__hasProp.call(t,r)&&(s=t[r],e.call(o,s,r,t))}catch(u){i=u}return t},_.map=function(t,e,o){var i;return nativeMap&&t.map===nativeMap?t.map(e,o):(i=[],_.each(t,function(t,n,r){return i.push(e.call(o,t,n,r))}),i)},_.reduce=function(t,e,o,i){return nativeReduce&&t.reduce===nativeReduce?(i&&(e=_.bind(e,i)),t.reduce(e,o)):(_.each(t,function(t,n,r){return o=e.call(i,o,t,n,r)}),o)},_.isArray=nativeIsArray||function(t){return!(!(t&&t.concat&&t.unshift)||t.callee)},_.max=function(t,e,o){var i;return!e&&_.isArray(t)?Math.max.apply(Math,t):(i={computed:-(1/0)},_.each(t,function(t,n,r){var s;return s=e?e.call(o,t,n,r):t,s>=i.computed&&(i={value:t,computed:s})}),i.value)},_.min=function(t,e,o){var i;return!e&&_.isArray(t)?Math.min.apply(Math,t):(i={computed:1/0},_.each(t,function(t,n,r){var s;return s=e?e.call(o,t,n,r):t,s<i.computed&&(i={value:t,computed:s})}),i.value)},_.now=Date.now||function(){return(new Date).getTime()},_.throttle=function(t,e,o){var i,n,r,s,a,h;return n=void 0,i=void 0,a=void 0,h=null,s=0,o||(o={}),r=function(){s=o.leading===!1?0:_.now(),h=null,a=t.apply(n,i),n=i=null},function(){var u,c;return u=_.now(),s||o.leading!==!1||(s=u),c=e-(u-s),n=this,i=arguments,0>=c?(clearTimeout(h),h=null,s=u,a=t.apply(n,i),n=i=null):h||o.trailing===!1||(h=setTimeout(r,c)),a}},_.debounce=function(t,e,o){var i,n,r,s,a,h;return a=void 0,i=void 0,n=void 0,h=void 0,s=void 0,r=function(){var u;u=_.now()-h,e>u?a=setTimeout(r,e-u):(a=null,o||(s=t.apply(n,i),n=i=null))},function(){var u;return n=this,i=arguments,h=_.now(),u=o&&!a,a||(a=setTimeout(r,e)),u&&(s=t.apply(n,i),n=i=null),s}}),function(){var t,e,o=function(t,e){return function(){return t.apply(e,arguments)}};this.Chromatic=this.Chromatic||{},t=function(){var t;return t={},function(e,o){var i,n,r,s,a,h,u,c,l,p,d,f,m,v,w,g,y,z;if(s=e.join()+o,t[s])return t[s];if(u=e.length,0>=o)return[];if(o>u)return e.map(function(t){return[t]});for(g=function(){var t,e,i;for(i=[],z=t=0,e=u;e>=0?e>t:t>e;z=e>=0?++t:--t)i.push(function(){var t,e,i;for(i=[],y=t=0,e=o;e>=0?e>t:t>e;y=e>=0?++t:--t)i.push(0);return i}());return i}(),w=function(){var t,e,i;for(i=[],z=t=0,e=u-1;e>=0?e>t:t>e;z=e>=0?++t:--t)i.push(function(){var t,e,i;for(i=[],y=t=0,e=o-1;e>=0?e>t:t>e;y=e>=0?++t:--t)i.push(0);return i}());return i}(),n=a=0,p=u;p>=0?p>a:a>p;n=p>=0?++a:--a)g[n][0]=e[n]+(n?g[n-1][0]:0);for(r=c=0,d=o;d>=0?d>c:c>d;r=d>=0?++c:--c)g[0][r]=e[0];for(n=l=1,f=u;f>=1?f>l:l>f;n=f>=1?++l:--l)for(r=v=1,m=o;m>=1?m>v:v>m;r=m>=1?++v:--v)h=_.min(function(){var t,e,o;for(e=[],y=o=0,t=n;t>=0?t>o:o>t;y=t>=0?++o:--o)e.push([_.max([g[y][r-1],g[n][0]-g[y][0]]),y]);return e}(),function(t){return t[0]}),g[n][r]=h[0],w[n-1][r-1]=h[1];for(u-=1,o-=2,i=[];o>=0;)i=[function(){var t,i,r,s;for(r=[],n=s=t=w[u-1][o]+1,i=u+1;i>=t?i>s:s>i;n=i>=t?++s:--s)r.push(e[n]);return r}()].concat(i),u=w[u-1][o],o-=1;return t[s]=[function(){var t,o,i;for(o=[],n=i=0,t=u+1;t>=0?t>i:i>t;n=t>=0?++i:--i)o.push(e[n]);return o}()].concat(i)}}(),e=function(){var t;return t=null,function(){var e,o,i;return t?t:(e=$('<div style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;"></div></div>'),$(document.body).append(e),o=$("div",e).innerWidth(),e.css("overflow-y","auto"),i=$("div",e).innerWidth(),$(e).remove(),t=o-i)}}(),Chromatic.GalleryView=function(){function i(t,e,i){this.zoom=o(this.zoom,this),this.layout=o(this.layout,this),this.lazyLoad=o(this.lazyLoad,this),this.calculateAspectRatios=o(this.calculateAspectRatios,this),t[0]===document.body?(this.el=$('<div class="chromatic-gallery-full"/>'),$(t).append(this.el)):this.el=$(t).addClass("chromatic-gallery"),this.photos=_.map(e,function(t){return _.isObject(t)?t:{small:t}}),this.zoom_view=new Chromatic.ZoomView(this.photos,i),this.photo_views=_.map(this.photos,function(t){return function(e){return new Chromatic.GalleryPhotoView(t,e,i)}}(this)),this.ideal_height=parseInt(this.el.children().first().css("height")),$(window).on("resize",_.debounce(this.layout,100)),this.el.on("scroll",_.throttle(this.lazyLoad,100)),this.photos[0].aspect_ratio?this.layout():this.calculateAspectRatios()}return i.prototype.calculateAspectRatios=function(){var t;return t=_.after(this.photos.length,this.layout),_.each(this.photo_views,function(e){return e.load(t)})},i.prototype.lazyLoad=function(){var t,e,o;return t=1e3,o=this.el.scrollTop()-t,e=(this.el.height()||$(window).height())+this.el.scrollTop()+t,_.each(this.photo_views,function(t){return function(t){return t.top<e&&t.bottom>o?t.load():t.unload()}}(this))},i.prototype.layout=function(){var o,i,n,r,s,a,h;return $(document.body).css("overflowY","scroll"),a=this.el[0].getBoundingClientRect().width-parseInt(this.el.css("paddingLeft"))-parseInt(this.el.css("paddingRight")),this.el[0].offsetWidth>this.el[0].scrollWidth&&(a-=e()),$(document.body).css("overflowY","auto"),o=this.ideal_height||parseInt((this.el.height()||$(window).height())/2),s=_.reduce(this.photos,function(t,e){return t+=e.aspect_ratio*o},0),r=Math.round(s/a),1>r?_.each(this.photos,function(t){return function(e,i){return t.photo_views[i].resize(parseInt(o*e.aspect_ratio),o)}}(this)):(h=_.map(this.photos,function(t){return parseInt(100*t.aspect_ratio)}),n=t(h,r),i=0,_.each(n,function(t){return function(e){var o,n;return o=[],_.each(e,function(e,n){return o.push(t.photos[i+n])}),n=_.reduce(o,function(t,e){return t+=e.aspect_ratio},0),s=0,_.each(o,function(e,r){var h,u;return u=r===o.length-1?a-s:parseInt(a/n*e.aspect_ratio),h=parseInt(a/n),t.photo_views[i+r].resize(u,h),s+=u}),i+=e.length}}(this))),this.lazyLoad()},i.prototype.zoom=function(t){return this.zoom_view.show(t)},i}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};this.Chromatic=this.Chromatic||{},Chromatic.GalleryPhotoView=function(){function e(e,o,i){this.zoom=t(this.zoom,this),this.unload=t(this.unload,this),this.load=t(this.load,this),this.parent=e,this.photo=o,this.el=$('<div class="chromatic-gallery-photo"/>'),e.el.append(this.el),this.el.on("click",this.zoom)}return e.prototype.load=function(t){var e;if(!this.loaded)return e=new Image,e.onload=function(o){return function(){return o.photo.aspect_ratio=e.width/e.height,t&&t(),o.el.css("backgroundImage","url("+o.photo.small+")"),o.loaded=!0}}(this),e.src=this.photo.small},e.prototype.unload=function(){return this.el.css("backgroundImage",""),this.loaded=!1},e.prototype.zoom=function(){return this.parent.zoom(this.photo)},e.prototype.resize=function(t,e){return this.el.css({width:t-parseInt(this.el.css("marginLeft"))-parseInt(this.el.css("marginRight")),height:e-parseInt(this.el.css("marginTop"))-parseInt(this.el.css("marginBottom"))}),this.top=this.el.position().top,this.bottom=this.top+this.el.height()},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};this.Chromatic=this.Chromatic||{},$.extend($.easing,{easeOutCirc:function(t,e,o,i,n){return i*Math.sqrt(1-(e=e/n-1)*e)+o}}),jQuery.event.special.swipe.settings.sensitivity=100,Chromatic.ZoomView=function(){function e(e,o){this.cancel=t(this.cancel,this),this.move=t(this.move,this),this.layout=t(this.layout,this),this.hideArrows=t(this.hideArrows,this),this.showArrows=t(this.showArrows,this),this.showPrevious=t(this.showPrevious,this),this.showNext=t(this.showNext,this),this.show=t(this.show,this),this.close=t(this.close,this),this.el=$('<div class="chromatic-zoom"/>'),this.el.html('<div class="chromatic-zoom-arrow-left"></div><div class="chromatic-zoom-arrow-right"></div>'),this.photos=e,$(document.body).append(this.el),this.el.hide().on("click swipeup",this.close).on("mousemove mouseenter",this.showArrows).on("mouseleave",this.hideArrows).on("click",".chromatic-zoom-arrow-left",this.showPrevious).on("swiperight",this.showPrevious).on("click",".chromatic-zoom-arrow-right",this.showNext).on("swipeleft",this.showNext).on("move",this.move).on("swipecanceled",this.cancel),this._debouncedLayout=_.debounce(function(t){return function(){return t.layout()}}(this),100)}return e.prototype.close=function(){return $(document.body).css("overflowY","auto"),clearTimeout(this.arrows_timer),key.unbind("esc"),key.unbind("enter"),key.unbind("up"),key.unbind("left"),key.unbind("j"),key.unbind("right"),key.unbind("k"),this.el.fadeOut(500,function(t){return function(){return t.previous_zoom_photo_view.remove(),t.current_zoom_photo_view.remove(),t.next_zoom_photo_view.remove(),t.previous_zoom_photo_view=null,t.current_zoom_photo_view=null,t.next_zoom_photo_view=null}}(this))},e.prototype.show=function(t){var e,o;return $(document.body).css("overflowY","hidden"),key("esc, enter, up",this.close),key("left, k",_.debounce(this.showPrevious,100,!0)),key("right, j",_.debounce(this.showNext,100,!0)),$(window).on("resize orientationchange",this._debouncedLayout),this.hideArrows(!1),this.el.fadeIn(500),this.previous_zoom_photo_view&&this.previous_zoom_photo_view.remove(),this.current_zoom_photo_view&&this.current_zoom_photo_view.remove(),this.next_zoom_photo_view&&this.next_zoom_photo_view.remove(),o=this.photos[this.photos.indexOf(t)-1]||this.photos[this.photos.length-1],this.current=t,e=this.photos[this.photos.indexOf(t)+1]||this.photos[0],this.previous_zoom_photo_view=new Chromatic.ZoomPhotoView(this,o),this.current_zoom_photo_view=new Chromatic.ZoomPhotoView(this,this.current),this.next_zoom_photo_view=new Chromatic.ZoomPhotoView(this,e),this.layout(),this.el.show()},e.prototype.showNext=function(t){var e;return t&&(t.preventDefault(),t.stopPropagation(),"keydown"===t.type?this.hideArrows():this.showArrows()),this.previous_zoom_photo_view.remove(),this.previous_zoom_photo_view=null,this.previous_zoom_photo_view=this.current_zoom_photo_view,this.current_zoom_photo_view=this.next_zoom_photo_view,this.current=this.photos[this.photos.indexOf(this.current)+1]||this.photos[0],e=this.photos[this.photos.indexOf(this.current)+1]||this.photos[0],this.next_zoom_photo_view=new Chromatic.ZoomPhotoView(this,e),this.previous_zoom_photo_view.layout("previous",0,!0),this.current_zoom_photo_view.layout("current",0,!0),this.next_zoom_photo_view.layout("next",0,!1)},e.prototype.showPrevious=function(t){var e;return t&&(t.preventDefault(),t.stopPropagation(),"keydown"===t.type?this.hideArrows():this.showArrows()),this.next_zoom_photo_view.remove(),this.next_zoom_photo_view=null,this.next_zoom_photo_view=this.current_zoom_photo_view,this.current_zoom_photo_view=this.previous_zoom_photo_view,this.current=this.photos[this.photos.indexOf(this.current)-1]||this.photos[this.photos.length-1],e=this.photos[this.photos.indexOf(this.current)-1]||this.photos[this.photos.length-1],this.previous_zoom_photo_view=new Chromatic.ZoomPhotoView(this,e),this.next_zoom_photo_view.layout("next",0,!0),this.current_zoom_photo_view.layout("current",0,!0),this.previous_zoom_photo_view.layout("previous",0,!1)},e.prototype.showArrows=function(){return this.el.find(".chromatic-zoom-arrow-left, .chromatic-zoom-arrow-right").stop().animate({opacity:1},200),clearTimeout(this.arrows_timer),this.arrows_timer=window.setTimeout(function(t){return function(){return t.hideArrows(!0)}}(this),3e3)},e.prototype.hideArrows=function(t){return this.el.find(".chromatic-zoom-arrow-left, .chromatic-zoom-arrow-right").animate({opacity:.01},null!=t?t:{1e3:0})},e.prototype.layout=function(t,e){return null==t&&(t=0),this.current_zoom_photo_view.layout("current",t,e),this.previous_zoom_photo_view.layout("previous",t,e),this.next_zoom_photo_view.layout("next",t,e)},e.prototype.move=function(t){return this.layout(t.distX,!1)},e.prototype.cancel=function(t){return this.layout(0,!0)},e}()}.call(this),function(){var t,e=function(t,e){return function(){return t.apply(e,arguments)}};this.Chromatic=this.Chromatic||{},t=function(){var t;return t="dontknow",function(){var e;return"dontknow"!==t?t:(e=$("<div/>"),$(document.body).append(e),e[0].style.webkitFilter="grayscale(1)",t="grayscale(1)"===window.getComputedStyle(e[0]).webkitFilter,e.remove(),t)}}(),Chromatic.ZoomPhotoView=function(){function o(t,o,i){this.layout=e(this.layout,this),this.render=e(this.render,this),this.remove=e(this.remove,this),this.photo=o,this.el=$("<div/>"),this.render(),t.el.append(this.el)}return o.prototype.remove=function(t){return this.el.remove()},o.prototype.render=function(){var e;return this.photo_el=$('<div class="chromatic-zoom-photo"></div>'),this.grain_el=$('<div class="chromatic-zoom-grain"></div>'),this.background_el=$('<div class="chromatic-zoom-background"></div>'),this.photo.big&&(e=new Image,e.onload=function(t){return function(){return t.photo_el.css("backgroundImage","url("+t.photo.big+")")}}(this),e.src=this.photo.big),this.photo_el.css("backgroundImage","url("+this.photo.small+")"),this.photo.blur?this.background_el.css("backgroundImage","url("+this.photo.blur+")"):t()&&this.background_el.addClass("chromatic-zoom-background-blur").css("backgroundImage","url("+this.photo.small+")"),this.el.append(this.photo_el,this.grain_el,this.background_el),this},o.prototype.layout=function(t,e,o){var i,n,r,s,a;return null==e&&(e=0),i=$(window),i.width()/i.height()>this.photo.aspect_ratio?(n=i.height(),a=i.height()*this.photo.aspect_ratio):(n=i.width()/this.photo.aspect_ratio,a=i.width()),this.photo_el.css({height:n,width:a,top:(i.height()-n)/2}),r=function(){switch(t){case"previous":return-a-20+e;case"current":return(i.width()-a)/2+e;case"next":return i.width()+20+e}}(),s=function(){switch(t){case"current":return 1-Math.abs(e)/i.width()*2;case"previous":return 0+e/i.width()*2;case"next":return 0-e/i.width()*2}}(),o?(this.photo_el.stop().animate({left:r},600,"easeOutCirc"),this.grain_el.stop().animate({opacity:s},600,"easeOutCirc"),this.background_el.stop().animate({opacity:s},600,"easeOutCirc")):(this.photo_el.css("left",r),this.grain_el.css("opacity",s),this.background_el.css("opacity",s))},o}()}.call(this),function(){$.fn.extend({chromatic:function(t,e){return new Chromatic.GalleryView(this,t,e),this}})}.call(this);