(function(){var a;a=function(){function a(a,b){var c,d;if(this.options={target:"instafeed",get:"popular",resolution:"thumbnail",sortBy:"none",links:!0,mock:!1,useHttp:!1},"object"==typeof a)for(c in a)d=a[c],this.options[c]=d;this.context=null!=b?b:this,this.unique=this._genKey()}return a.prototype.hasNext=function(){return"string"==typeof this.context.nextUrl&&this.context.nextUrl.length>0},a.prototype.next=function(){return!!this.hasNext()&&this.run(this.context.nextUrl)},a.prototype.run=function(b){var c,d,e;if("string"!=typeof this.options.clientId&&"string"!=typeof this.options.accessToken)throw new Error("Missing clientId or accessToken.");if("string"!=typeof this.options.accessToken&&"string"!=typeof this.options.clientId)throw new Error("Missing clientId or accessToken.");return null!=this.options.before&&"function"==typeof this.options.before&&this.options.before.call(this),"undefined"!=typeof document&&null!==document&&(e=document.createElement("script"),e.id="instafeed-fetcher",e.src=b||this._buildUrl(),c=document.getElementsByTagName("head"),c[0].appendChild(e),d="instafeedCache"+this.unique,window[d]=new a(this.options,this),window[d].unique=this.unique),!0},a.prototype.parse=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H;if("object"!=typeof a){if(null!=this.options.error&&"function"==typeof this.options.error)return this.options.error.call(this,"Invalid JSON data"),!1;throw new Error("Invalid JSON response")}if(200!==a.meta.code){if(null!=this.options.error&&"function"==typeof this.options.error)return this.options.error.call(this,a.meta.error_message),!1;throw new Error("Error from Instagram: "+a.meta.error_message)}if(0===a.data.length){if(null!=this.options.error&&"function"==typeof this.options.error)return this.options.error.call(this,"No images were returned from Instagram"),!1;throw new Error("No images were returned from Instagram")}if(null!=this.options.success&&"function"==typeof this.options.success&&this.options.success.call(this,a),this.context.nextUrl="",null!=a.pagination&&(this.context.nextUrl=a.pagination.next_url),"none"!==this.options.sortBy)switch(F="random"===this.options.sortBy?["","random"]:this.options.sortBy.split("-"),E="least"===F[0],F[1]){case"random":a.data.sort(function(){return.5-Math.random()});break;case"recent":a.data=this._sortBy(a.data,"created_time",E);break;case"liked":a.data=this._sortBy(a.data,"likes.count",E);break;case"commented":a.data=this._sortBy(a.data,"comments.count",E);break;default:throw new Error("Invalid option for sortBy: '"+this.options.sortBy+"'.")}if("undefined"!=typeof document&&null!==document&&this.options.mock===!1){if(q=a.data,D=parseInt(this.options.limit,10),null!=this.options.limit&&q.length>D&&(q=q.slice(0,D)),h=document.createDocumentFragment(),null!=this.options.filter&&"function"==typeof this.options.filter&&(q=this._filter(q,this.options.filter)),null!=this.options.template&&"string"==typeof this.options.template){for(j="",o="",u="",H=document.createElement("div"),l=0,z=q.length;l<z;l++){if(m=q[l],n=m.images[this.options.resolution],"object"!=typeof n)throw g="No image found for resolution: "+this.options.resolution+".",new Error(g);v=n.width,s=n.height,t="square",v>s&&(t="landscape"),v<s&&(t="portrait"),p=n.url,k=window.location.protocol.indexOf("http")>=0,k&&!this.options.useHttp&&(p=p.replace(/https?:\/\//,"//")),o=this._makeTemplate(this.options.template,{model:m,id:m.id,link:m.link,type:m.type,image:p,width:v,height:s,orientation:t,caption:this._getObjectProperty(m,"caption.text"),likes:m.likes.count,comments:m.comments.count,location:this._getObjectProperty(m,"location.name")}),j+=o}for(H.innerHTML=j,e=[],d=0,c=H.childNodes.length;d<c;)e.push(H.childNodes[d]),d+=1;for(x=0,A=e.length;x<A;x++)C=e[x],h.appendChild(C)}else for(y=0,B=q.length;y<B;y++){if(m=q[y],r=document.createElement("img"),n=m.images[this.options.resolution],"object"!=typeof n)throw g="No image found for resolution: "+this.options.resolution+".",new Error(g);p=n.url,k=window.location.protocol.indexOf("http")>=0,k&&!this.options.useHttp&&(p=p.replace(/https?:\/\//,"//")),r.src=p,this.options.links===!0?(b=document.createElement("a"),b.href=m.link,b.appendChild(r),h.appendChild(b)):h.appendChild(r)}if(G=this.options.target,"string"==typeof G&&(G=document.getElementById(G)),null==G)throw g='No element with id="'+this.options.target+'" on page.',new Error(g);G.appendChild(h),i=document.getElementsByTagName("head")[0],i.removeChild(document.getElementById("instafeed-fetcher")),w="instafeedCache"+this.unique,window[w]=void 0;try{delete window[w]}catch(a){f=a}}return null!=this.options.after&&"function"==typeof this.options.after&&this.options.after.call(this),!0},a.prototype._buildUrl=function(){var a,b,c;switch(a="https://api.instagram.com/v1",this.options.get){case"popular":b="media/popular";break;case"tagged":if(!this.options.tagName)throw new Error("No tag name specified. Use the 'tagName' option.");b="tags/"+this.options.tagName+"/media/recent";break;case"location":if(!this.options.locationId)throw new Error("No location specified. Use the 'locationId' option.");b="locations/"+this.options.locationId+"/media/recent";break;case"user":if(!this.options.userId)throw new Error("No user specified. Use the 'userId' option.");b="users/"+this.options.userId+"/media/recent";break;default:throw new Error("Invalid option for get: '"+this.options.get+"'.")}return c=a+"/"+b,c+=null!=this.options.accessToken?"?access_token="+this.options.accessToken:"?client_id="+this.options.clientId,null!=this.options.limit&&(c+="&count="+this.options.limit),c+="&callback=instafeedCache"+this.unique+".parse"},a.prototype._genKey=function(){var a;return a=function(){return(65536*(1+Math.random())|0).toString(16).substring(1)},""+a()+a()+a()+a()},a.prototype._makeTemplate=function(a,b){var c,d,e,f,g;for(d=/(?:\{{2})([\w\[\]\.]+)(?:\}{2})/,c=a;d.test(c);)f=c.match(d)[1],g=null!=(e=this._getObjectProperty(b,f))?e:"",c=c.replace(d,function(){return""+g});return c},a.prototype._getObjectProperty=function(a,b){var c,d;for(b=b.replace(/\[(\w+)\]/g,".$1"),d=b.split(".");d.length;){if(c=d.shift(),!(null!=a&&c in a))return null;a=a[c]}return a},a.prototype._sortBy=function(a,b,c){var d;return d=function(a,d){var e,f;return e=this._getObjectProperty(a,b),f=this._getObjectProperty(d,b),c?e>f?1:-1:e<f?1:-1},a.sort(d.bind(this)),a},a.prototype._filter=function(a,b){var c,d,e,f,g;for(c=[],d=function(a){if(b(a))return c.push(a)},e=0,g=a.length;e<g;e++)f=a[e],d(f);return c},a}(),function(a,b){return"function"==typeof define&&define.amd?define([],b):"object"==typeof module&&module.exports?module.exports=b():a.Instafeed=b()}(this,function(){return a})}).call(this);
