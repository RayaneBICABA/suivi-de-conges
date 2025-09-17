import{a as E}from"./config-CkEC2-gR.js";import"./authGuard-IHeZeQgb.js";const d=E;let g=[],l=null;document.addEventListener("DOMContentLoaded",function(){h(),y(),C(),j()});async function h(){try{const e=await fetch(`${d}/dashboard`);if(!e.ok)throw new Error("Erreur lors du chargement des statistiques");const t=await e.json();document.getElementById("totalAgents").textContent=t.totalAgent||0,document.getElementById("congesEnCours").textContent=t.congeEnCours||0,document.getElementById("congesTermines").textContent=t.congeTermines||0}catch(e){console.error("Erreur lors du chargement des statistiques:",e),p("Erreur lors du chargement des statistiques","error")}}async function y(){try{const e=await fetch(`${d}/dashboard/agents`);if(!e.ok)throw new Error("Erreur lors du chargement de la liste des agents");const t=await e.json();g=t,c(t)}catch(e){console.error("Erreur lors du chargement de la liste des agents:",e),p("Erreur lors du chargement de la liste des agents","error")}}function c(e){const t=document.getElementById("agentsList");if(t){if(e.length===0){t.innerHTML=`
            <tr>
                <td colspan="4" class="py-8 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-2 opacity-50"></i>
                    <p>Aucun agent trouvé</p>
                </td>
            </tr>
        `;return}t.innerHTML=e.map(n=>{const s=b(n.fullname),r=w(n.matricule);return`
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 md:py-4 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">
                    ${n.matricule}
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 ${r} rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
                            ${s}
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
        `}).join("")}}async function $(e){try{A();const t=await fetch(`${d}/dashboard/${e}/details`);if(!t.ok)throw t.status===404?new Error("Agent non trouvé"):new Error("Erreur lors du chargement des détails de l'agent");const n=await t.json();l=n,L(n),v(n)}catch(t){console.error("Erreur lors du chargement des détails de l'agent:",t),D(t.message)}}function L(e){const t=document.getElementById("yearFilter");if(!t||!e.conges)return;const n=t.value,s=[...new Set(e.conges.map(r=>r.annee))].sort((r,o)=>{const u=r.length===2?`20${r}`:r,m=o.length===2?`20${o}`:o;return parseInt(m)-parseInt(u)});if(s.length===0){t.innerHTML=`
            <option value="">Aucune année disponible</option>
        `;return}t.innerHTML=s.map(r=>{const o=r.length===2?`20${r}`:r;return`<option value="${r}" ${r===n?"selected":""}>${o}</option>`}).join(""),s.includes(n)||(t.value=s[0])}function v(e){const t=document.getElementById("agentDetails");if(!t)return;const s=document.getElementById("yearFilter")?.value||(e.conges&&e.conges.length>0?e.conges[0].annee:new Date().getFullYear().toString()),r=e.conges?e.conges.filter(a=>a.annee===s):[],o=`${e.prenom} ${e.nom}`,u=b(o),m=w(e.matricule),f=s.length===2?`20${s}`:s;t.innerHTML=`
        <div class="space-y-4">
            <!-- Informations de l'agent -->
            <div class="text-center mb-6">
                <div class="w-16 h-16 ${m} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    ${u}
                </div>
                <h3 class="text-xl font-bold text-gray-800">${o}</h3>
                <p class="text-gray-600">${e.fonction||"Non spécifié"}</p>
                <p class="text-sm text-gray-500">Matricule: ${e.matricule}</p>
            </div>
            
            <!-- Congés pour l'année sélectionnée -->
            <div class="space-y-4">
                <h4 class="font-semibold text-gray-800">Congés ${f}</h4>
                ${r.length===0?`
                    <div class="text-center py-6 text-gray-500">
                        <i class="fas fa-calendar-times text-3xl mb-2 opacity-50"></i>
                        <p class="text-sm">Aucun congé pour l'année ${f}</p>
                    </div>
                `:r.map(a=>`
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="space-y-2">
                            <div class="flex justify-between items-start">
                                <span class="font-medium text-gray-800">Réf: ${a.reference}</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ${a.annee.length===2?`20${a.annee}`:a.annee}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Jours attribués:</span>
                                    <span class="font-bold text-blue-600">${a.joursAttribues||0}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Jours restants:</span>
                                    <span class="font-bold ${a.joursRestants>0?"text-green-600":"text-red-600"}">
                                        ${a.joursRestants||0}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Suivis de congé -->
                            ${a.suivis&&a.suivis.length>0?`
                                <div class="mt-3">
                                    <h5 class="text-sm font-medium text-gray-700 mb-2">Historique des congés:</h5>
                                    <div class="space-y-2">
                                        ${a.suivis.map(i=>`
                                            <div class="bg-white rounded p-2 border border-gray-100 text-sm">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">
                                                        ${x(i.dateDebut)} - ${x(i.dateFin)}
                                                    </span>
                                                    <span class="font-medium text-orange-600">
                                                        ${i.jours} jour${i.jours>1?"s":""}
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
    `}function b(e){return e.split(" ").map(t=>t.charAt(0)).join("").toUpperCase().substring(0,2)}function w(e){const t=["bg-blue-500","bg-green-500","bg-purple-500","bg-red-500","bg-yellow-500","bg-indigo-500","bg-pink-500","bg-teal-500"],n=e.split("").reduce((s,r)=>s+r.charCodeAt(0),0);return t[n%t.length]}function x(e){return new Date(e).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})}function A(){const e=document.getElementById("agentDetails");e&&(e.innerHTML=`
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-gray-500">Chargement des détails...</p>
        </div>
    `)}function D(e){const t=document.getElementById("agentDetails");t&&(t.innerHTML=`
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-gray-600">${e}</p>
        </div>
    `)}function C(){const e=document.getElementById("searchInput");if(!e)return;let t;e.addEventListener("input",function(){clearTimeout(t),t=setTimeout(()=>{const n=this.value.trim();n===""?c(g):I(n)},300)})}async function I(e){try{const t=await fetch(`${d}/dashboard/agents/search?keyword=${encodeURIComponent(e)}`);if(!t.ok)throw new Error("Erreur lors de la recherche");const n=await t.json();c(n)}catch(t){console.error("Erreur lors de la recherche:",t),p("Erreur lors de la recherche","error");const n=g.filter(s=>s.fullname.toLowerCase().includes(e.toLowerCase())||s.matricule.toLowerCase().includes(e.toLowerCase())||s.fonction&&s.fonction.toLowerCase().includes(e.toLowerCase()));c(n)}}function j(){const e=document.getElementById("yearFilter");e&&e.addEventListener("change",function(){l&&v(l)})}function p(e,t="info"){const n=document.createElement("div");n.className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full";const s={success:"bg-green-500 text-white",error:"bg-red-500 text-white",warning:"bg-yellow-500 text-black",info:"bg-blue-500 text-white"};n.className+=` ${s[t]||s.info}`;const r={success:"fas fa-check-circle",error:"fas fa-exclamation-circle",warning:"fas fa-exclamation-triangle",info:"fas fa-info-circle"};n.innerHTML=`
        <div class="flex items-center space-x-2">
            <i class="${r[t]||r.info}"></i>
            <span>${e}</span>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>{n.classList.remove("translate-x-full")},100),setTimeout(()=>{n.classList.add("translate-x-full"),setTimeout(()=>{document.body.removeChild(n)},300)},5e3)}function B(){h(),y();const e=document.getElementById("agentDetails");e&&(e.innerHTML=`
            <div class="text-center text-gray-500 py-6 md:py-8">
                <i class="fas fa-user-circle text-4xl md:text-6xl mb-3 md:mb-4"></i>
                <p class="text-sm md:text-base">Sélectionnez un agent pour voir ses détails</p>
            </div>
        `);const t=document.getElementById("yearFilter");t&&(t.innerHTML=`
            <option value="">Sélectionnez un agent</option>
        `),l=null}window.voirDetails=$;window.refreshDashboard=B;function T(){setTimeout(()=>{const e=document.getElementById("logoutBtn")||document.querySelector('[onclick*="AuthGuard.logout"]');e&&(e.removeAttribute("onclick"),e.addEventListener("click",function(t){t.preventDefault(),window.AuthGuard?window.AuthGuard.logout():(console.error("AuthGuard non disponible"),localStorage.clear(),window.location.href="./src/html/login.html")}))},200)}document.addEventListener("DOMContentLoaded",T);
