var fe=(t,e)=>()=>(e||t((e={exports:{}}).exports,e),e.exports);import{a as d}from"./config-CkEC2-gR.js";var Ne=fe((He,F)=>{class w{static async checkAuth(){try{const e=this.getToken();return e?await this.verifyTokenWithServer(e)?!0:(this.clearAuthData(),this.redirectToLogin(),!1):(this.redirectToLogin(),!1)}catch(e){return console.error("Erreur lors de la vérification d'authentification:",e),this.clearAuthData(),this.redirectToLogin(),!1}}static async verifyTokenWithServer(e){try{return(await fetch(`${d}/api/auth/verify-token`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:e})})).ok}catch(n){return console.error("Erreur lors de la vérification du token:",n),!1}}static getToken(){return localStorage.getItem("authToken")}static getUserData(){const e=localStorage.getItem("userData");return e?JSON.parse(e):null}static isTokenExpired(){const e=localStorage.getItem("tokenExpiration");return e?new Date>new Date(e):!0}static clearAuthData(){localStorage.removeItem("authToken"),localStorage.removeItem("userData"),localStorage.removeItem("tokenExpiration")}static redirectToLogin(){const e=window.location.pathname+window.location.search;localStorage.setItem("redirectAfterLogin",e),window.location.href="./login.html"}static redirectAfterLogin(){const e=localStorage.getItem("redirectAfterLogin");localStorage.removeItem("redirectAfterLogin"),e&&e!=="/login.html"?window.location.href=e:window.location.href="./index.html"}static setupAPIInterceptor(){const e=window.fetch;window.fetch=async function(n,o={}){if(n.includes(d)){const r=w.getToken();r&&(o.headers={...o.headers,Authorization:`Bearer ${r}`})}try{const r=await e(n,o);return r.status===401&&n.includes(d)&&w.handleUnauthorized(),r}catch(r){throw r}}}static handleUnauthorized(){this.clearAuthData(),this.showSessionExpiredMessage(),setTimeout(()=>{this.redirectToLogin()},3e3)}static showSessionExpiredMessage(){const e=document.createElement("div");e.className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4",e.innerHTML=`
            <div class="bg-white rounded-lg p-6 max-w-md w-full mx-auto text-center">
                <div class="mb-4">
                    <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.502 0L4.312 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">Session expirée</h3>
                <p class="text-sm text-gray-500 mb-4">
                    Votre session a expiré. Vous allez être redirigé vers la page de connexion.
                </p>
                <button onclick="this.parentElement.parentElement.remove(); AuthGuard.redirectToLogin();" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Se reconnecter maintenant
                </button>
            </div>
        `,document.body.appendChild(e)}static async init(){this.setupAPIInterceptor();const e=["index.html","dashboard.html"],n=window.location.pathname.split("/").pop();return e.includes(n)||n===""?await this.checkAuth()?(this.displayUserInfo(),!0):!1:!0}static displayUserInfo(){const e=this.getUserData();if(!e)return;document.querySelectorAll("[data-user-display]").forEach(o=>{switch(o.getAttribute("data-user-display")){case"fullname":o.textContent=`${e.firstname} ${e.lastname}`;break;case"firstname":o.textContent=e.firstname;break;case"username":o.textContent=e.username;break;case"email":o.textContent=e.email;break}})}static logout(){this.clearAuthData(),confirm("Êtes-vous sûr de vouloir vous déconnecter ?")&&(this.notifyServerLogout(),this.redirectToLogin())}static async notifyServerLogout(){try{const e=this.getToken();e&&await fetch(`${d}/api/auth/logout`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${e}`}})}catch(e){console.log("Impossible de notifier le serveur de la déconnexion:",e)}}}document.addEventListener("DOMContentLoaded",async function(){await w.init()});typeof F<"u"&&F.exports&&(F.exports=w);window.AuthGuard=w;document.addEventListener("DOMContentLoaded",()=>{const t=document.querySelectorAll(".menu-link"),e=document.querySelectorAll(".mobile-menu-link"),n=document.querySelectorAll("#dashboard, #manageLeaves, #addAgent, #priseCongeSection");function o(s){s.querySelectorAll("input").forEach(i=>{i.type==="checkbox"||i.type==="radio"?i.checked=!1:(i.type,i.value="")}),s.querySelectorAll("textarea").forEach(i=>i.value=""),s.querySelectorAll("select").forEach(i=>i.selectedIndex=0),s.querySelectorAll("span, div").forEach(i=>{i.id==="pcNumDays"||i.id==="pcJoursRestants"||i.id==="pcJoursAttribues"?i.textContent="":i.classList.contains("resetable")&&(i.textContent="--")})}function r(){typeof window.refreshDashboard=="function"?window.refreshDashboard():(console.log("Rafraîchissement du tableau de bord..."),typeof window.loadDashboardStats=="function"&&window.loadDashboardStats(),typeof window.loadAgentsList=="function"&&window.loadAgentsList())}function a(s,u,m){n.forEach(x=>x.classList.add("hidden"));const S=document.getElementById(s);if(S&&(S.classList.remove("hidden"),o(S),s==="dashboard"&&setTimeout(()=>{r()},100)),m.forEach(x=>x.classList.remove("bg-[#0423d0]","rounded-2xl")),u){u.classList.add("bg-[#0423d0]","rounded-2xl");const x=u.getAttribute("data-target");m.forEach(i=>{i.getAttribute("data-target")===x&&i.classList.add("bg-[#0423d0]","rounded-2xl")})}}const l=[...t,...e];t.forEach(s=>{s.addEventListener("click",u=>{u.preventDefault();const m=s.getAttribute("data-target");a(m,s,l)})}),e.forEach(s=>{s.addEventListener("click",u=>{u.preventDefault();const m=s.getAttribute("data-target");a(m,s,l),typeof closeMobileMenuFunc=="function"&&closeMobileMenuFunc()})});const g=document.querySelector(`button[onclick="switchToSection('addAgent')"]`),p=document.querySelector(`button[onclick="switchToSection('manageLeaves')"]`);g&&(g.removeAttribute("onclick"),g.addEventListener("click",()=>{a("addAgent",null,l)})),p&&(p.removeAttribute("onclick"),p.addEventListener("click",()=>{a("manageLeaves",null,l)})),window.switchToSection=function(s){a(s,null,l),s==="dashboard"&&setTimeout(()=>{r()},100)};const c=document.getElementById("dashboard");c&&(c.classList.remove("hidden"),setTimeout(()=>{r()},100)),l.filter(s=>s.getAttribute("data-target")==="dashboard").forEach(s=>{s.classList.add("bg-[#0423d0]","rounded-2xl")});let Y="dashboard";const pe=new MutationObserver(s=>{s.forEach(u=>{if(u.type==="attributes"&&u.attributeName==="class"){const m=u.target;!m.classList.contains("hidden")&&m.id!==Y&&(Y=m.id,m.id==="dashboard"&&setTimeout(()=>{r()},100))}})});n.forEach(s=>{pe.observe(s,{attributes:!0,attributeFilter:["class"]})})});window.forceRefreshDashboard=function(){typeof window.refreshDashboard=="function"&&window.refreshDashboard()};const J=d;let V=[],P=null;document.addEventListener("DOMContentLoaded",function(){X(),_(),be(),we()});async function X(){try{const t=await fetch(`${J}/dashboard`);if(!t.ok)throw new Error("Erreur lors du chargement des statistiques");const e=await t.json();document.getElementById("totalAgents").textContent=e.totalAgent||0,document.getElementById("congesEnCours").textContent=e.congeEnCours||0,document.getElementById("congesTermines").textContent=e.congeTermines||0}catch(t){console.error("Erreur lors du chargement des statistiques:",t),z("Erreur lors du chargement des statistiques","error")}}async function _(){try{const t=await fetch(`${J}/dashboard/agents`);if(!t.ok)throw new Error("Erreur lors du chargement de la liste des agents");const e=await t.json();V=e,H(e)}catch(t){console.error("Erreur lors du chargement de la liste des agents:",t),z("Erreur lors du chargement de la liste des agents","error")}}function H(t){const e=document.getElementById("agentsList");if(e){if(t.length===0){e.innerHTML=`
            <tr>
                <td colspan="4" class="py-8 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-2 opacity-50"></i>
                    <p>Aucun agent trouvé</p>
                </td>
            </tr>
        `;return}e.innerHTML=t.map(n=>{const o=te(n.fullname),r=ne(n.matricule);return`
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 md:py-4 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">
                    ${n.matricule}
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 ${r} rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                            ${o}
                        </div>
                        <span class="font-medium text-gray-900 text-sm md:text-base">${n.fullname}</span>
                    </div>
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4 text-gray-600 text-sm md:text-base">
                    ${n.fonction||"Non spécifié"}
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4 text-center">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors"
                        onclick="voirDetails('${n.matricule}')">
                        Détails
                    </button>
                </td>
            </tr>
        `}).join("")}}async function he(t){try{ve();const e=await fetch(`${J}/dashboard/${t}/details`);if(!e.ok)throw e.status===404?new Error("Agent non trouvé"):new Error("Erreur lors du chargement des détails de l'agent");const n=await e.json();P=n,ye(n),ee(n)}catch(e){console.error("Erreur lors du chargement des détails de l'agent:",e),xe(e.message),z(e.message,"error")}}function ye(t){const e=document.getElementById("yearFilter");if(!e||!t.conges)return;const n=e.value,o=[...new Set(t.conges.map(r=>r.annee))].sort((r,a)=>{const l=r.length===2?`20${r}`:r,g=a.length===2?`20${a}`:a;return parseInt(g)-parseInt(l)});if(o.length===0){e.innerHTML=`
            <option value="">Aucune année disponible</option>
        `;return}e.innerHTML=o.map(r=>{const a=r.length===2?`20${r}`:r;return`<option value="${r}" ${r===n?"selected":""}>${a}</option>`}).join(""),o.includes(n)||(e.value=o[0])}function ee(t){const e=document.getElementById("agentDetails");if(!e)return;const o=document.getElementById("yearFilter")?.value||(t.conges&&t.conges.length>0?t.conges[0].annee:new Date().getFullYear().toString()),r=t.conges?t.conges.filter(c=>c.annee===o):[],a=`${t.prenom} ${t.nom}`,l=te(a),g=ne(t.matricule),p=o.length===2?`20${o}`:o;e.innerHTML=`
        <div class="space-y-4">
            <!-- Informations de l'agent -->
            <div class="text-center mb-6">
                <div class="w-16 h-16 ${g} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    ${l}
                </div>
                <h3 class="text-xl font-bold text-gray-800">${a}</h3>
                <p class="text-gray-600">${t.fonction||"Non spécifié"}</p>
                <p class="text-sm text-gray-500">Matricule: ${t.matricule}</p>
            </div>
            
            <!-- Congés pour l'année sélectionnée -->
            <div class="space-y-4">
                <h4 class="font-semibold text-gray-800">Congés ${p}</h4>
                ${r.length===0?`
                    <div class="text-center py-6 text-gray-500">
                        <i class="fas fa-calendar-times text-3xl mb-2 opacity-50"></i>
                        <p class="text-sm">Aucun congé pour l'année ${p}</p>
                    </div>
                `:r.map(c=>`
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="space-y-2">
                            <div class="flex justify-between items-start">
                                <span class="font-medium text-gray-800">Réf: ${c.reference}</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ${c.annee.length===2?`20${c.annee}`:c.annee}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Jours attribués:</span>
                                    <span class="font-bold text-blue-600">${c.joursAttribues||0}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Jours restants:</span>
                                    <span class="font-bold ${c.joursRestants>0?"text-green-600":"text-red-600"}">
                                        ${c.joursRestants||0}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Suivis de congé -->
                            ${c.suivis&&c.suivis.length>0?`
                                <div class="mt-3">
                                    <h5 class="text-sm font-medium text-gray-700 mb-2">Historique des congés:</h5>
                                    <div class="space-y-2">
                                        ${c.suivis.map(y=>`
                                            <div class="bg-white rounded p-2 border border-gray-100 text-sm">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">
                                                        ${Q(y.dateDebut)} - ${Q(y.dateFin)}
                                                    </span>
                                                    <span class="font-medium text-orange-600">
                                                        ${y.jours} jour${y.jours>1?"s":""}
                                                    </span>
                                                </div>
                                            </div>
                                        `).join("")}
                                    </div>
                                </div>
                            `:`
                                <div class="mt-3 text-center text-gray-500 text-sm">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Aucun congé pris pour cette référence
                                </div>
                            `}
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `}function te(t){return t.split(" ").map(e=>e.charAt(0)).join("").toUpperCase().substring(0,2)}function ne(t){const e=["bg-blue-500","bg-green-500","bg-purple-500","bg-red-500","bg-yellow-500","bg-indigo-500","bg-pink-500","bg-teal-500"],n=t.split("").reduce((o,r)=>o+r.charCodeAt(0),0);return e[n%e.length]}function Q(t){return new Date(t).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})}function ve(){const t=document.getElementById("agentDetails");t&&(t.innerHTML=`
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-gray-500">Chargement des détails...</p>
        </div>
    `)}function xe(t){const e=document.getElementById("agentDetails");e&&(e.innerHTML=`
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-gray-600">${t}</p>
        </div>
    `)}function be(){const t=document.getElementById("searchInput");if(!t)return;let e;t.addEventListener("input",function(){clearTimeout(e),e=setTimeout(()=>{const n=this.value.trim();n===""?H(V):Ee(n)},300)})}async function Ee(t){try{const e=await fetch(`${J}/dashboard/agents/search?keyword=${encodeURIComponent(t)}`);if(!e.ok)throw new Error("Erreur lors de la recherche");const n=await e.json();H(n)}catch(e){console.error("Erreur lors de la recherche:",e),z("Erreur lors de la recherche","error");const n=V.filter(o=>o.fullname.toLowerCase().includes(t.toLowerCase())||o.matricule.toLowerCase().includes(t.toLowerCase())||o.fonction&&o.fonction.toLowerCase().includes(t.toLowerCase()));H(n)}}function we(){const t=document.getElementById("yearFilter");t&&t.addEventListener("change",function(){P&&ee(P)})}function z(t,e="info"){const n=document.createElement("div");n.className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full";const o={success:"bg-green-500 text-white",error:"bg-red-500 text-white",warning:"bg-yellow-500 text-black",info:"bg-blue-500 text-white"};n.className+=` ${o[e]||o.info}`;const r={success:"fas fa-check-circle",error:"fas fa-exclamation-circle",warning:"fas fa-exclamation-triangle",info:"fas fa-info-circle"};n.innerHTML=`
        <div class="flex items-center space-x-2">
            <i class="${r[e]||r.info}"></i>
            <span>${t}</span>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>{n.classList.remove("translate-x-full")},100),setTimeout(()=>{n.classList.add("translate-x-full"),setTimeout(()=>{document.body.removeChild(n)},300)},5e3)}function Le(){X(),_();const t=document.getElementById("agentDetails");t&&(t.innerHTML=`
            <div class="text-center text-gray-500 py-6 md:py-8">
                <i class="fas fa-user-circle text-4xl md:text-6xl mb-3 md:mb-4"></i>
                <p class="text-sm md:text-base">Sélectionnez un agent pour voir ses détails</p>
            </div>
        `);const e=document.getElementById("yearFilter");e&&(e.innerHTML=`
            <option value="">Sélectionnez un agent</option>
        `),P=null}window.voirDetails=he;window.refreshDashboard=Le;function f(t,e="info"){const n={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"},o=document.createElement("div");o.className=`${n[e]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`,o.textContent=t,document.body.appendChild(o),setTimeout(()=>{o.remove()},4e3)}const L=document.getElementById("pcStartDate"),I=document.getElementById("pcEndDate"),T=document.getElementById("pcNumDays"),W=document.getElementById("pcAddCongeBtn");let N="";function M(t){N=t}function G(){if(!L||!I||!T)return;const t=new Date(L.value),e=new Date(I.value);if(t.toString()!=="Invalid Date"&&e.toString()!=="Invalid Date"&&e>=t){const n=e-t,o=Math.floor(n/(1e3*60*60*24))+1;T.textContent=o}else T.textContent=0}L&&I&&(L.addEventListener("change",G),I.addEventListener("change",G));async function Ie(t){try{const e=`${d}/suivi-conge/jours-restants?reference=${encodeURIComponent(t)}`,n=await fetch(e),o=await n.json();if(!n.ok)throw new Error(o.message||"Impossible de récupérer les jours restants");const r=document.getElementById("pcJoursRestants");r&&(r.textContent=o.joursRestants??"--")}catch(e){console.error("Erreur fetch jours restants:",e);const n=document.getElementById("pcJoursRestants");n&&(n.textContent="--")}}W&&W.addEventListener("click",async()=>{const t=document.getElementById("pcMatricule"),e=document.getElementById("pcJoursRestants");if(!t||!e){f("❌ Éléments manquants dans le DOM","error");return}const n=t.textContent.trim(),o=L.value,r=I.value,a=parseInt(T.textContent,10),l=parseInt(e.textContent,10);if(!N){f("⚠️ Référence de congé invalide.","info");return}if(!n||n==="--"){f("⚠️ Matricule agent introuvable.","error");return}if(!o||!r){f("⚠️ Veuillez choisir la période.","error");return}if(!a||a<=0){f("⚠️ Nombre de jours invalide.","error");return}if(a>l){f(`⚠️ Vous demandez ${a} jours alors qu'il ne reste que ${l} jours.`,"error");return}const g={matricule:n,congeRef:N,dateDebut:o,dateFin:r,jours:a};try{const p=await fetch(`${d}/suivi-conge`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)}),c=await p.json();if(!p.ok){const y=c.message||"Erreur lors de l'ajout du congé";throw new Error(`❌ ${y}`)}f(`✅ Congé ajouté avec succès (ID: ${c.id})`,"success"),L.value="",I.value="",T.textContent="0",await Ie(N)}catch(p){f("error.message"+p.message,"error")}});function R(t,e="info"){const n={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"},o=document.createElement("div");o.className=`${n[e]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`,o.textContent=t,document.body.appendChild(o),setTimeout(()=>{o.remove()},4e3)}const oe=document.getElementById("refNumber"),re=document.getElementById("year"),Ce=document.getElementById("checkBtn"),b=document.getElementById("result"),se=document.getElementById("retourBtn"),C=document.getElementById("popupCongeOverlay"),$e=document.getElementById("popupCloseBtn"),Ae=document.getElementById("popupDecisionNumber"),D=document.getElementById("popupNom"),B=document.getElementById("popupPrenom"),v=document.getElementById("popupMatricule"),ae=document.getElementById("popupJoursConges"),De=document.getElementById("popupConfirmerBtn"),Be=document.getElementById("popupAnnulerBtn"),Te=document.getElementById("manageLeaves"),ke=document.getElementById("priseCongeSection");let ie="",ce="",q="";function je(){C.classList.remove("hidden"),C.classList.add("flex"),q=`${ie}/DRH/${ce}`,Ae.value=q}function O(){C.classList.add("hidden"),C.classList.remove("flex")}function le(){v.value="",ae.value="0",D.value="",B.value=""}function de(){document.querySelectorAll("#dashboard, #addAgent, #priseCongeSection").forEach(t=>t.classList.add("hidden")),Te.classList.remove("hidden"),oe.value="",re.value="2025",b.innerHTML="",se.classList.add("hidden")}function ue(t){document.querySelectorAll("#dashboard, #manageLeaves, #addAgent").forEach(e=>e.classList.add("hidden")),ke.classList.remove("hidden"),Se(t)}async function me(t){if(!t.trim()){D.value="",B.value="";return}try{const e=await fetch(`${d}/agent/nomPrenom?matricule=${encodeURIComponent(t)}`);if(e.ok){const n=await e.json();D.value=n.nom||"",B.value=n.prenom||""}else D.value="",B.value=""}catch(e){D.value="",B.value="",console.error(e)}}async function Se(t){try{const e=await fetch(`${d}/agent/byConge?ref=${encodeURIComponent(t)}`);if(!e.ok)throw new Error("Agent non trouvé");const n=await e.json(),o=n.agent,r=n.jours??0,g=(await(await fetch(`${d}/suivi-conge/jours-restants?reference=${encodeURIComponent(t)}`)).json()).joursRestants??0;document.getElementById("pcRefConge").textContent=t,document.getElementById("pcMatricule").textContent=o.matricule??"-",document.getElementById("pcNom").textContent=o.nom??"-",document.getElementById("pcPrenom").textContent=o.prenom??"-",document.getElementById("pcFonction").textContent=o.fonction??"-",document.getElementById("pcJoursAttribues").textContent=r,document.getElementById("pcJoursRestants").textContent=g,typeof M=="function"&&M(t)}catch(e){console.error("Erreur récupération infos congé:",e),document.getElementById("pcRefConge").textContent=t,document.getElementById("pcMatricule").textContent="-",document.getElementById("pcNom").textContent="-",document.getElementById("pcPrenom").textContent="-",document.getElementById("pcFonction").textContent="-",document.getElementById("pcJoursAttribues").textContent="0",document.getElementById("pcJoursRestants").textContent="0",typeof M=="function"&&M(t)}}Ce.addEventListener("click",async()=>{const t=oe.value.trim(),e=re.value.trim();if(!t||!e){b.innerHTML=`<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;return}ie=t,ce=e;const n=`${t}/DRH/${e}`;try{const o=await fetch(`${d}/conge/checkRef?refNumber=${t}&year=${e}`),r=await o.text();o.ok?(b.innerHTML=`<span class="text-green-600">Référence trouvée : <b>${n}</b></span>`,setTimeout(()=>ue(n),500)):(b.innerHTML=`<span class="text-red-600">${r}</span>`,setTimeout(je,300))}catch(o){b.innerHTML=`<span class="text-red-600">Erreur: ${o.message}</span>`}});se.addEventListener("click",de);document.getElementById("retourPriseCongeBtn").addEventListener("click",de);$e.addEventListener("click",O);C.addEventListener("click",t=>{t.target===C&&O()});Be.addEventListener("click",()=>{le(),O()});De.addEventListener("click",async()=>{const t=v.value.trim(),e=parseInt(ae.value)||0;if(!t)return R("Veuillez saisir un matricule.","info");if(e<=0)return R("Nombre de jours invalide.","info");const n={reference:q,matriculeAgent:t,jours:e};try{const o=await fetch(`${d}/conge`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),r=await o.json();if(o.ok)O(),le(),b.innerHTML='<span class="text-green-600">Congé créé avec succès !</span>',setTimeout(()=>ue(q),500);else{const a=r.message||"Erreur lors de la création du congé";R("❌ ${message}","error")}}catch(o){R(`Erreur de connexion : ${o.message}`,"error")}});v.addEventListener("input",t=>{clearTimeout(v.searchTimeout),v.searchTimeout=setTimeout(()=>{me(t.target.value.trim())},500)});v.addEventListener("blur",()=>me(v.value.trim()));function k(t,e="info"){const n={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"},o=document.createElement("div");o.className=`${n[e]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`,o.textContent=t,document.body.appendChild(o),setTimeout(()=>{o.remove()},4e3)}const $=document.getElementById("agentNom"),A=document.getElementById("agentPrenom"),h=document.getElementById("agentMatricule"),j=document.getElementById("agentFonction"),E=document.getElementById("addAgentBtn"),Z=document.getElementById("cancelBtn");let U=!1;function ge(){$&&($.value=""),A&&(A.value=""),h&&(h.value=""),j&&(j.value="")}function Me(t){k(`⌫ ${t}`,"error")}function Re(){const t=$?.value.trim(),e=A?.value.trim(),n=h?.value.trim(),o=j?.value.trim();return!t||!e||!n||!o?(k("Veuillez remplir tous les champs","info"),!1):n.length<3?(k("Le matricule doit contenir au moins 3 caractères","info"),h?.focus(),!1):!0}async function K(){if(U||!Re())return;const t={matricule:h.value.trim().toUpperCase(),nom:$.value.trim(),prenom:A.value.trim(),fonction:j.value.trim()};try{U=!0,E.disabled=!0,E.textContent="Ajout en cours...";const e=await fetch(`${d}/agent`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(t)});if(!e.ok){let o="Erreur lors de l'ajout de l'agent";try{o=(await e.json()).message||o}catch{e.status===415?o="Format de données non supporté":e.status===400?o="Données invalides":e.status===409?o="Le matricule existe déjà":o=`Erreur ${e.status}: ${e.statusText}`}throw new Error(o)}const n=await e.json();k(`Agent enregistré avec succès !
Matricule: ${n.matricule}
Nom complet: ${n.prenom} ${n.nom}`,"success"),ge()}catch(e){console.error("Erreur lors de l'ajout de l'agent:",e),Me(e.message||"Erreur de connexion au serveur")}finally{U=!1,E.disabled=!1,E.textContent="Ajouter"}}document.addEventListener("DOMContentLoaded",()=>{E&&E.addEventListener("click",t=>{t.preventDefault(),K()}),Z&&Z.addEventListener("click",t=>{t.preventDefault(),ge(),k("Formulaire réinitialisé","success")}),h&&h.addEventListener("input",t=>{t.target.value=t.target.value.toUpperCase(),t.target.value=t.target.value.replace(/[^A-Z0-9]/g,"")}),[$,A].forEach(t=>{t&&t.addEventListener("input",e=>{e.target.value=e.target.value.replace(/[0-9]/g,""),e.target.value=e.target.value.replace(/\b\w/g,n=>n.toUpperCase())})}),[$,A,h,j].forEach(t=>{t&&t.addEventListener("keypress",e=>{e.key==="Enter"&&(e.preventDefault(),K())})})})});export default Ne();
