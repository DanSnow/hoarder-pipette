const y="modulepreload",w=function(p){return"/hoarder-pipette/"+p},g={},S=function(m,l,c){let h=Promise.resolve();if(l&&l.length>0){let o=function(n){return Promise.all(n.map(a=>Promise.resolve(a).then(r=>({status:"fulfilled",value:r}),r=>({status:"rejected",reason:r}))))};document.getElementsByTagName("link");const t=document.querySelector("meta[property=csp-nonce]"),u=t?.nonce||t?.getAttribute("nonce");h=o(l.map(n=>{if(n=w(n),n in g)return;g[n]=!0;const a=n.endsWith(".css"),r=a?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${n}"]${r}`))return;const e=document.createElement("link");if(e.rel=a?"stylesheet":y,a||(e.as="script"),e.crossOrigin="",e.href=n,u&&e.setAttribute("nonce",u),document.head.appendChild(e),a)return new Promise((i,s)=>{e.addEventListener("load",i),e.addEventListener("error",()=>s(new Error(`Unable to preload CSS for ${n}`)))})}))}function d(o){const t=new Event("vite:preloadError",{cancelable:!0});if(t.payload=o,window.dispatchEvent(t),!t.defaultPrevented)throw o}return h.then(o=>{for(const t of o||[])t.status==="rejected"&&d(t.reason);return m().catch(d)})},E={ranking:{pageLength:.1,termFrequency:.1,termSaturation:2,termSimilarity:9}};class v extends HTMLElement{constructor(){super();const m=this.querySelector("button[data-open-modal]"),l=this.querySelector("button[data-close-modal]"),c=this.querySelector("dialog"),h=this.querySelector(".dialog-frame"),d=e=>{("href"in(e.target||{})||document.body.contains(e.target)&&!h.contains(e.target))&&t()},o=e=>{c.showModal(),document.body.toggleAttribute("data-search-modal-open",!0),this.querySelector("input")?.focus(),e?.stopPropagation(),window.addEventListener("click",d)},t=()=>c.close();m.addEventListener("click",o),m.disabled=!1,l.addEventListener("click",t),c.addEventListener("close",()=>{document.body.toggleAttribute("data-search-modal-open",!1),window.removeEventListener("click",d)}),window.addEventListener("keydown",e=>{(e.metaKey===!0||e.ctrlKey===!0)&&e.key==="k"&&(c.open?t():o(),e.preventDefault())});let u={};try{u=JSON.parse(this.dataset.translations||"{}")}catch{}const r=this.dataset.stripTrailingSlash!==void 0?e=>e.replace(/(.)\/(#.*)?$/,"$1$2"):e=>e;window.addEventListener("DOMContentLoaded",()=>{(window.requestIdleCallback||(i=>setTimeout(i,1)))(async()=>{const{PagefindUI:i}=await S(async()=>{const{PagefindUI:s}=await import("./ui-core.CIGK73-k.js");return{PagefindUI:s}},[]);new i({...E,element:"#starlight__search",baseUrl:"/hoarder-pipette",bundlePath:"/hoarder-pipette".replace(/\/$/,"")+"/pagefind/",showImages:!1,translations:u,showSubResults:!0,processResult:s=>{s.url=r(s.url),s.sub_results=s.sub_results.map(f=>(f.url=r(f.url),f))}})})})}}customElements.define("site-search",v);export{S as _};
