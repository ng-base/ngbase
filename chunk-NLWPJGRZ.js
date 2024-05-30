import{d as B}from"./chunk-A7LS32QN.js";import{Bb as M,Cb as L,Ga as y,Ia as D,Ja as a,L as b,S as m,W as w,Y as S,eb as d,fb as E,gb as p,la as g,na as f,nb as x,sb as h,tb as k,wc as P,zc as R}from"./chunk-WQ6QWIFQ.js";var T=["hueDiv"],A=["spectrumDiv"],V=["spectrumSelector"],_=["hueSelector"],$=["selectedColor"],F=(()=>{let r=class r{constructor(){this.hueDiv=a("hueDiv"),this.spectrumDiv=a("spectrumDiv"),this.spectrumSelector=a("spectrumSelector"),this.hueSelector=a("hueSelector"),this.selectedColor=a("selectedColor"),this.el=m(f),this.value=D("#FF7B00"),this.onChange=e=>{},this.onTouched=()=>{},this.hue=0,this.colorChange=g(),this.localValue="",y(()=>{let e=this.hueDiv().nativeElement,t=this.spectrumDiv().nativeElement;e.addEventListener("mousedown",o=>{this.hueEvents(o.offsetX);let n=i=>{i.preventDefault(),i.stopPropagation(),requestAnimationFrame(()=>{let{left:u,width:C}=e.getBoundingClientRect(),l=i.clientX-u;l>0&&l<=C&&this.hueEvents(l)})},s=()=>{document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",s),this.colorChange.emit(this.localValue)};document.addEventListener("mousemove",n),document.addEventListener("mouseup",s)}),t.addEventListener("mousedown",o=>{this.spectrumEvents(o);let n=i=>{i.preventDefault(),i.stopPropagation(),requestAnimationFrame(()=>this.spectrumEvents(i))},s=()=>{document.removeEventListener("mousemove",n),document.removeEventListener("mouseup",s),this.colorChange.emit(this.localValue)};document.addEventListener("mousemove",n),document.addEventListener("mouseup",s)})})}spectrumEvents(e){let t=this.spectrumDiv().nativeElement.getBoundingClientRect(),o=e.clientX-t.left,n=e.clientY-t.top;o=Math.max(0,Math.min(o,t.width)),n=Math.max(0,Math.min(n,t.height));let s=o/t.width*100,i=n/t.height*100,{s:u,l:C}=this.calculate(s,i),l=this.spectrumSelector().nativeElement;l.style.left=`${o-l.offsetWidth/2}px`,l.style.top=`${n-l.offsetHeight/2}px`;let v=`hsl(${this.hue}, ${u}%, ${C}%)`;l.style.backgroundColor=v,this.el.nativeElement.style.setProperty("--spectrum-color",v),this.selectedColor().nativeElement.style.backgroundColor=v,this.lastSpectrumEvent=e,this.localValue=v}calculate(e,t){let o=e/100*100,n=100-t/100*100,s=1+e/100;return{s:o,l:n/s}}hueEvents(e){let t=this.hueDiv().nativeElement.getBoundingClientRect();this.hue=e/t.width*360,this.el.nativeElement.style.setProperty("--hue-color",`hsl(${this.hue}, 100%, 50%)`);let o=this.hueSelector().nativeElement,{width:n}=o.getBoundingClientRect();o.style.left=e-n/2-2+"px",this.lastSpectrumEvent&&this.spectrumEvents(this.lastSpectrumEvent)}rgbToHue(e,t,o){e/=255,t/=255,o/=255;let n=Math.max(e,t,o),s=Math.min(e,t,o),i=0;if(n===s)i=0;else{let u=n-s;switch(n){case e:i=(t-o)/u+(t<o?6:0);break;case t:i=(o-e)/u+2;break;case o:i=(e-t)/u+4;break}i/=6}return Math.round(i*360)}writeValue(e){this.value.set(e)}registerOnChange(e){this.onChange=e}registerOnTouched(e){this.onTouched=e}};r.\u0275fac=function(t){return new(t||r)},r.\u0275cmp=w({type:r,selectors:[["mee-color-picker-container"]],viewQuery:function(t,o){t&1&&(h(o.hueDiv,T,5),h(o.spectrumDiv,A,5),h(o.spectrumSelector,V,5),h(o.hueSelector,_,5),h(o.selectedColor,$,5)),t&2&&k(5)},hostAttrs:[1,"inline-block","min-w-[260px]"],outputs:{colorChange:"colorChange"},standalone:!0,features:[M([{provide:P,useExisting:b(()=>r),multi:!0}]),L],decls:18,vars:0,consts:[["spectrumDiv",""],["spectrumSelector",""],["selectedColor",""],["hueDiv",""],["hueSelector",""],[1,"flex","w-full","flex-col","gap-4"],[1,"relative","overflow-hidden"],[1,"h-[160px]","w-full",2,"background-image","linear-gradient(0deg, rgb(0, 0, 0), transparent), linear-gradient(90deg, rgb(255, 255, 255), rgba(255, 255, 255, 0))","background-color","var(--hue-color)"],[1,"pointer-events-none","absolute","-left-2","-top-2","h-4","w-4","cursor-pointer","rounded-full"],[1,"flex","gap-5"],[1,"aspect-square","w-10","bg-slate-500"],[1,"flex","flex-1","flex-col","gap-4"],[1,"relative"],[1,"h-[12px]","w-full",2,"inset","0px","background","linear-gradient(to right, rgb(255, 0, 0), rgb(255, 255, 0), rgb(0, 255, 0), rgb(0, 255, 255), rgb(0, 0, 255), rgb(255, 0, 255), rgb(255, 0, 0))"],[1,"border-red","pointer-events-none","absolute","-left-3","-top-1","h-5","w-5","cursor-pointer","rounded-full","border-2"],[1,"h-[12px]","w-full",2,"inset","0px","background","linear-gradient(to right, rgba(255, 0, 4, 0), var(--spectrum-color))"]],template:function(t,o){t&1&&(d(0,"div",5)(1,"div",6),p(2,"div",7,0)(4,"button",8,1),E(),d(6,"div",9),p(7,"div",10,2),d(9,"div",11)(10,"div",12),p(11,"div",13,3)(13,"button",14,4),E(),d(15,"div",12),p(16,"div",15)(17,"button",14),E()()()())},styles:["[_nghost-%COMP%]{--hue-color: rgb(255, 0, 0);--spectrum-color: rgb(0, 0, 0)}"]});let c=r;return c})();var Y=(()=>{let r=class r{constructor(){this.control=m(R,{optional:!0,self:!0}),this.el=m(f),this.popover=B(),this.colorChanged=g()}open(){let e=this.popover.open(F,{target:this.el.nativeElement,position:"bl",offset:0})}};r.\u0275fac=function(t){return new(t||r)},r.\u0275dir=S({type:r,selectors:[["","meeColorPickerTrigger",""]],hostBindings:function(t,o){t&1&&x("click",function(){return o.open()})},outputs:{colorChanged:"colorChanged"},standalone:!0});let c=r;return c})();export{Y as a};
