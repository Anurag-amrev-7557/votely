"use client";import{a as O}from"./chunk-U5LWHTWZ.js";import{d as D}from"./chunk-TEDR2MDT.js";var T=D(O(),1),$=D(O(),1),b=D(O(),1);var U={data:""},V=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||U;var q=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Y=/\/\*[^]*?\*\/|  +/g,F=/\n+/g,v=(e,t)=>{let r="",o="",n="";for(let a in e){let i=e[a];a[0]=="@"?a[1]=="i"?r=a+" "+i+";":o+=a[1]=="f"?v(i,a):a+"{"+v(i,a[1]=="k"?"":t)+"}":typeof i=="object"?o+=v(i,t?t.replace(/([^,])+/g,s=>a.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,s):s?s+" "+l:l)):a):i!=null&&(a=/^--/.test(a)?a:a.replace(/[A-Z]/g,"-$&").toLowerCase(),n+=v.p?v.p(a,i):a+":"+i+";")}return r+(t&&n?t+"{"+n+"}":n)+o},h={},H=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+H(e[r]);return t}return e},Z=(e,t,r,o,n)=>{let a=H(e),i=h[a]||(h[a]=(l=>{let d=0,c=11;for(;d<l.length;)c=101*c+l.charCodeAt(d++)>>>0;return"go"+c})(a));if(!h[i]){let l=a!==e?e:(d=>{let c,y,f=[{}];for(;c=q.exec(d.replace(Y,""));)c[4]?f.shift():c[3]?(y=c[3].replace(F," ").trim(),f.unshift(f[0][y]=f[0][y]||{})):f[0][c[1]]=c[2].replace(F," ").trim();return f[0]})(e);h[i]=v(n?{["@keyframes "+i]:l}:l,r?"":"."+i)}let s=r&&h.g?h.g:null;return r&&(h.g=h[i]),((l,d,c,y)=>{y?d.data=d.data.replace(y,l):d.data.indexOf(l)===-1&&(d.data=c?l+d.data:d.data+l)})(h[i],t,o,s),i},J=(e,t,r)=>e.reduce((o,n,a)=>{let i=t[a];if(i&&i.call){let s=i(r),l=s&&s.props&&s.props.className||/^go/.test(s)&&s;i=l?"."+l:s&&typeof s=="object"?s.props?"":v(s,""):s===!1?"":s}return o+n+(i??"")},"");function j(e){let t=this||{},r=e.call?e(t.p):e;return Z(r.unshift?r.raw?J(r,[].slice.call(arguments,1),t.p):r.reduce((o,n)=>Object.assign(o,n&&n.call?n(t.p):n),{}):r,V(t.target),t.g,t.o,t.k)}var L,S,M,Ne=j.bind({g:1}),u=j.bind({k:1});function _(e,t,r,o){v.p=t,L=e,S=r,M=o}function m(e,t){let r=this||{};return function(){let o=arguments;function n(a,i){let s=Object.assign({},a),l=s.className||n.className;r.p=Object.assign({theme:S&&S()},s),r.o=/ *go\d+/.test(l),s.className=j.apply(r,o)+(l?" "+l:""),t&&(s.ref=i);let d=e;return e[0]&&(d=s.as||e,delete s.as),M&&d[0]&&M(s),L(d,s)}return t?t(n):n}}var w=D(O(),1);var x=D(O(),1),K=e=>typeof e=="function",A=(e,t)=>K(e)?e(t):e,Q=(()=>{let e=0;return()=>(++e).toString()})(),R=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),W=20,B=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,W)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===t.toast.id?{...a,...t.toast}:a)};case 2:let{toast:r}=t;return B(e,{type:e.toasts.find(a=>a.id===r.id)?1:0,toast:r});case 3:let{toastId:o}=t;return{...e,toasts:e.toasts.map(a=>a.id===o||o===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+n}))}}},z=[],E={toasts:[],pausedAt:void 0},k=e=>{E=B(E,e),z.forEach(t=>{t(E)})},X={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},G=(e={})=>{let[t,r]=(0,T.useState)(E),o=(0,T.useRef)(E);(0,T.useEffect)(()=>(o.current!==E&&r(E),z.push(r),()=>{let a=z.indexOf(r);a>-1&&z.splice(a,1)}),[]);let n=t.toasts.map(a=>{var i,s,l;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((i=e[a.type])==null?void 0:i.removeDelay)||e?.removeDelay,duration:a.duration||((s=e[a.type])==null?void 0:s.duration)||e?.duration||X[a.type],style:{...e.style,...(l=e[a.type])==null?void 0:l.style,...a.style}}});return{...t,toasts:n}},ee=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:r?.id||Q()}),I=e=>(t,r)=>{let o=ee(t,e,r);return k({type:2,toast:o}),o.id},p=(e,t)=>I("blank")(e,t);p.error=I("error");p.success=I("success");p.loading=I("loading");p.custom=I("custom");p.dismiss=e=>{k({type:3,toastId:e})};p.remove=e=>k({type:4,toastId:e});p.promise=(e,t,r)=>{let o=p.loading(t.loading,{...r,...r?.loading});return typeof e=="function"&&(e=e()),e.then(n=>{let a=t.success?A(t.success,n):void 0;return a?p.success(a,{id:o,...r,...r?.success}):p.dismiss(o),n}).catch(n=>{let a=t.error?A(t.error,n):void 0;a?p.error(a,{id:o,...r,...r?.error}):p.dismiss(o)}),e};var te=(e,t)=>{k({type:1,toast:{id:e,height:t}})},ae=()=>{k({type:5,time:Date.now()})},C=new Map,re=1e3,se=(e,t=re)=>{if(C.has(e))return;let r=setTimeout(()=>{C.delete(e),k({type:4,toastId:e})},t);C.set(e,r)},oe=e=>{let{toasts:t,pausedAt:r}=G(e);(0,$.useEffect)(()=>{if(r)return;let a=Date.now(),i=t.map(s=>{if(s.duration===1/0)return;let l=(s.duration||0)+s.pauseDuration-(a-s.createdAt);if(l<0){s.visible&&p.dismiss(s.id);return}return setTimeout(()=>p.dismiss(s.id),l)});return()=>{i.forEach(s=>s&&clearTimeout(s))}},[t,r]);let o=(0,$.useCallback)(()=>{r&&k({type:6,time:Date.now()})},[r]),n=(0,$.useCallback)((a,i)=>{let{reverseOrder:s=!1,gutter:l=8,defaultPosition:d}=i||{},c=t.filter(g=>(g.position||d)===(a.position||d)&&g.height),y=c.findIndex(g=>g.id===a.id),f=c.filter((g,P)=>P<y&&g.visible).length;return c.filter(g=>g.visible).slice(...s?[f+1]:[0,f]).reduce((g,P)=>g+(P.height||0)+l,0)},[t]);return(0,$.useEffect)(()=>{t.forEach(a=>{if(a.dismissed)se(a.id,a.removeDelay);else{let i=C.get(a.id);i&&(clearTimeout(i),C.delete(a.id))}})},[t]),{toasts:t,handlers:{updateHeight:te,startPause:ae,endPause:o,calculateOffset:n}}},ie=u`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,ne=u`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,le=u`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,de=m("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ie} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${ne} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${le} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,ce=u`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,pe=m("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${ce} 1s linear infinite;
`,ue=u`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,me=u`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,fe=m("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ue} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${me} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,ye=m("div")`
  position: absolute;
`,ge=m("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,he=u`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,be=m("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${he} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,ve=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?w.createElement(be,null,t):t:r==="blank"?null:w.createElement(ge,null,w.createElement(pe,{...o}),r!=="loading"&&w.createElement(ye,null,r==="error"?w.createElement(de,{...o}):w.createElement(fe,{...o})))},xe=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,we=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,Ee="0%{opacity:0;} 100%{opacity:1;}",ke="0%{opacity:1;} 100%{opacity:0;}",$e=m("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,Te=m("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,De=(e,t)=>{let r=e.includes("top")?1:-1,[o,n]=R()?[Ee,ke]:[xe(r),we(r)];return{animation:t?`${u(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${u(n)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Oe=b.memo(({toast:e,position:t,style:r,children:o})=>{let n=e.height?De(e.position||t||"top-center",e.visible):{opacity:0},a=b.createElement(ve,{toast:e}),i=b.createElement(Te,{...e.ariaProps},A(e.message,e));return b.createElement($e,{className:e.className,style:{...n,...r,...e.style}},typeof o=="function"?o({icon:a,message:i}):b.createElement(b.Fragment,null,a,i))});_(x.createElement);var je=({id:e,className:t,style:r,onHeightUpdate:o,children:n})=>{let a=x.useCallback(i=>{if(i){let s=()=>{let l=i.getBoundingClientRect().height;o(e,l)};s(),new MutationObserver(s).observe(i,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return x.createElement("div",{ref:a,className:t,style:r},n)},Ce=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},n=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:R()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...n}},Ie=j`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,N=16,Le=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:n,containerStyle:a,containerClassName:i})=>{let{toasts:s,handlers:l}=oe(r);return x.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:N,left:N,right:N,bottom:N,pointerEvents:"none",...a},className:i,onMouseEnter:l.startPause,onMouseLeave:l.endPause},s.map(d=>{let c=d.position||t,y=l.calculateOffset(d,{reverseOrder:e,gutter:o,defaultPosition:t}),f=Ce(c,y);return x.createElement(je,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?Ie:"",style:f},d.type==="custom"?A(d.message,d):n?n(d):x.createElement(Oe,{toast:d,position:c}))}))},_e=p;export{fe as CheckmarkIcon,de as ErrorIcon,pe as LoaderIcon,Oe as ToastBar,ve as ToastIcon,Le as Toaster,_e as default,A as resolveValue,p as toast,oe as useToaster,G as useToasterStore};
//# sourceMappingURL=react-hot-toast.js.map
