import{a as h}from"./config-DuvyDCry.js";document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelectorAll(".menu-link"),t=document.querySelectorAll(".mobile-menu-link"),n=document.querySelectorAll("#dashboard, #manageLeaves, #addAgent, #priseCongeSection");function s(r){r.querySelectorAll("input").forEach(c=>{c.type==="checkbox"||c.type==="radio"?c.checked=!1:(c.type,c.value="")}),r.querySelectorAll("textarea").forEach(c=>c.value=""),r.querySelectorAll("select").forEach(c=>c.selectedIndex=0),r.querySelectorAll("span, div").forEach(c=>{c.id==="pcNumDays"||c.id==="pcJoursRestants"||c.id==="pcJoursAttribues"?c.textContent="":c.classList.contains("resetable")&&(c.textContent="--")})}function o(){typeof window.refreshDashboard=="function"?window.refreshDashboard():(console.log("Rafraîchissement du tableau de bord..."),typeof window.loadDashboardStats=="function"&&window.loadDashboardStats(),typeof window.loadAgentsList=="function"&&window.loadAgentsList())}function a(r,d,u){n.forEach(b=>b.classList.add("hidden"));const S=document.getElementById(r);if(S&&(S.classList.remove("hidden"),s(S),r==="dashboard"&&setTimeout(()=>{o()},100)),u.forEach(b=>b.classList.remove("bg-[#0423d0]","rounded-2xl")),d){d.classList.add("bg-[#0423d0]","rounded-2xl");const b=d.getAttribute("data-target");u.forEach(c=>{c.getAttribute("data-target")===b&&c.classList.add("bg-[#0423d0]","rounded-2xl")})}}const l=[...e,...t];e.forEach(r=>{r.addEventListener("click",d=>{d.preventDefault();const u=r.getAttribute("data-target");a(u,r,l)})}),t.forEach(r=>{r.addEventListener("click",d=>{d.preventDefault();const u=r.getAttribute("data-target");a(u,r,l),typeof closeMobileMenuFunc=="function"&&closeMobileMenuFunc()})});const m=document.querySelector(`button[onclick="switchToSection('addAgent')"]`),g=document.querySelector(`button[onclick="switchToSection('manageLeaves')"]`);m&&(m.removeAttribute("onclick"),m.addEventListener("click",()=>{a("addAgent",null,l)})),g&&(g.removeAttribute("onclick"),g.addEventListener("click",()=>{a("manageLeaves",null,l)})),window.switchToSection=function(r){a(r,null,l),r==="dashboard"&&setTimeout(()=>{o()},100)};const i=document.getElementById("dashboard");i&&(i.classList.remove("hidden"),setTimeout(()=>{o()},100)),l.filter(r=>r.getAttribute("data-target")==="dashboard").forEach(r=>{r.classList.add("bg-[#0423d0]","rounded-2xl")});let U="dashboard";const me=new MutationObserver(r=>{r.forEach(d=>{if(d.type==="attributes"&&d.attributeName==="class"){const u=d.target;!u.classList.contains("hidden")&&u.id!==U&&(U=u.id,u.id==="dashboard"&&setTimeout(()=>{o()},100))}})});n.forEach(r=>{me.observe(r,{attributes:!0,attributeFilter:["class"]})})});window.forceRefreshDashboard=function(){typeof window.refreshDashboard=="function"&&window.refreshDashboard()};const q="http://192.168.40.64:8080";let z=[],N=null;document.addEventListener("DOMContentLoaded",function(){G(),K(),ye(),be()});async function G(){try{const e=await fetch(`${q}/dashboard`);if(!e.ok)throw new Error("Erreur lors du chargement des statistiques");const t=await e.json();document.getElementById("totalAgents").textContent=t.totalAgent||0,document.getElementById("congesEnCours").textContent=t.congeEnCours||0,document.getElementById("congesTermines").textContent=t.congeTermines||0}catch(e){console.error("Erreur lors du chargement des statistiques:",e),P("Erreur lors du chargement des statistiques","error")}}async function K(){try{const e=await fetch(`${q}/dashboard/agents`);if(!e.ok)throw new Error("Erreur lors du chargement de la liste des agents");const t=await e.json();z=t,F(t)}catch(e){console.error("Erreur lors du chargement de la liste des agents:",e),P("Erreur lors du chargement de la liste des agents","error")}}function F(e){const t=document.getElementById("agentsList");if(t){if(e.length===0){t.innerHTML=`
            <tr>
                <td colspan="4" class="py-8 text-center text-gray-500">
                    <i class="fas fa-users text-4xl mb-2 opacity-50"></i>
                    <p>Aucun agent trouvé</p>
                </td>
            </tr>
        `;return}t.innerHTML=e.map(n=>{const s=X(n.fullname),o=ee(n.matricule);return`
            <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td class="py-3 md:py-4 px-2 md:px-4 font-medium text-gray-900 text-sm md:text-base">
                    ${n.matricule}
                </td>
                <td class="py-3 md:py-4 px-2 md:px-4">
                    <div class="flex items-center space-x-2 md:space-x-3">
                        <div class="w-6 h-6 md:w-8 md:h-8 ${o} rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm">
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
        `}).join("")}}async function ge(e){try{fe();const t=await fetch(`${q}/dashboard/${e}/details`);if(!t.ok)throw t.status===404?new Error("Agent non trouvé"):new Error("Erreur lors du chargement des détails de l'agent");const n=await t.json();N=n,pe(n),W(n)}catch(t){console.error("Erreur lors du chargement des détails de l'agent:",t),he(t.message),P(t.message,"error")}}function pe(e){const t=document.getElementById("yearFilter");if(!t||!e.conges)return;const n=t.value,s=[...new Set(e.conges.map(o=>o.annee))].sort((o,a)=>{const l=o.length===2?`20${o}`:o,m=a.length===2?`20${a}`:a;return parseInt(m)-parseInt(l)});if(s.length===0){t.innerHTML=`
            <option value="">Aucune année disponible</option>
        `;return}t.innerHTML=s.map(o=>{const a=o.length===2?`20${o}`:o;return`<option value="${o}" ${o===n?"selected":""}>${a}</option>`}).join(""),s.includes(n)||(t.value=s[0])}function W(e){const t=document.getElementById("agentDetails");if(!t)return;const s=document.getElementById("yearFilter")?.value||(e.conges&&e.conges.length>0?e.conges[0].annee:new Date().getFullYear().toString()),o=e.conges?e.conges.filter(i=>i.annee===s):[],a=`${e.prenom} ${e.nom}`,l=X(a),m=ee(e.matricule),g=s.length===2?`20${s}`:s;t.innerHTML=`
        <div class="space-y-4">
            <!-- Informations de l'agent -->
            <div class="text-center mb-6">
                <div class="w-16 h-16 ${m} rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
                    ${l}
                </div>
                <h3 class="text-xl font-bold text-gray-800">${a}</h3>
                <p class="text-gray-600">${e.fonction||"Non spécifié"}</p>
                <p class="text-sm text-gray-500">Matricule: ${e.matricule}</p>
            </div>
            
            <!-- Congés pour l'année sélectionnée -->
            <div class="space-y-4">
                <h4 class="font-semibold text-gray-800">Congés ${g}</h4>
                ${o.length===0?`
                    <div class="text-center py-6 text-gray-500">
                        <i class="fas fa-calendar-times text-3xl mb-2 opacity-50"></i>
                        <p class="text-sm">Aucun congé pour l'année ${g}</p>
                    </div>
                `:o.map(i=>`
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div class="space-y-2">
                            <div class="flex justify-between items-start">
                                <span class="font-medium text-gray-800">Réf: ${i.reference}</span>
                                <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    ${i.annee.length===2?`20${i.annee}`:i.annee}
                                </span>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Jours attribués:</span>
                                    <span class="font-bold text-blue-600">${i.joursAttribues||0}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Jours restants:</span>
                                    <span class="font-bold ${i.joursRestants>0?"text-green-600":"text-red-600"}">
                                        ${i.joursRestants||0}
                                    </span>
                                </div>
                            </div>
                            
                            <!-- Suivis de congé -->
                            ${i.suivis&&i.suivis.length>0?`
                                <div class="mt-3">
                                    <h5 class="text-sm font-medium text-gray-700 mb-2">Historique des congés:</h5>
                                    <div class="space-y-2">
                                        ${i.suivis.map(y=>`
                                            <div class="bg-white rounded p-2 border border-gray-100 text-sm">
                                                <div class="flex justify-between items-center">
                                                    <span class="text-gray-600">
                                                        ${V(y.dateDebut)} - ${V(y.dateFin)}
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
    `}function X(e){return e.split(" ").map(t=>t.charAt(0)).join("").toUpperCase().substring(0,2)}function ee(e){const t=["bg-blue-500","bg-green-500","bg-purple-500","bg-red-500","bg-yellow-500","bg-indigo-500","bg-pink-500","bg-teal-500"],n=e.split("").reduce((s,o)=>s+o.charCodeAt(0),0);return t[n%t.length]}function V(e){return new Date(e).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric"})}function fe(){const e=document.getElementById("agentDetails");e&&(e.innerHTML=`
        <div class="text-center py-8">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p class="text-gray-500">Chargement des détails...</p>
        </div>
    `)}function he(e){const t=document.getElementById("agentDetails");t&&(t.innerHTML=`
        <div class="text-center py-8">
            <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p class="text-gray-600">${e}</p>
        </div>
    `)}function ye(){const e=document.getElementById("searchInput");if(!e)return;let t;e.addEventListener("input",function(){clearTimeout(t),t=setTimeout(()=>{const n=this.value.trim();n===""?F(z):ve(n)},300)})}async function ve(e){try{const t=await fetch(`${q}/dashboard/agents/search?keyword=${encodeURIComponent(e)}`);if(!t.ok)throw new Error("Erreur lors de la recherche");const n=await t.json();F(n)}catch(t){console.error("Erreur lors de la recherche:",t),P("Erreur lors de la recherche","error");const n=z.filter(s=>s.fullname.toLowerCase().includes(e.toLowerCase())||s.matricule.toLowerCase().includes(e.toLowerCase())||s.fonction&&s.fonction.toLowerCase().includes(e.toLowerCase()));F(n)}}function be(){const e=document.getElementById("yearFilter");e&&e.addEventListener("change",function(){N&&W(N)})}function P(e,t="info"){const n=document.createElement("div");n.className="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full";const s={success:"bg-green-500 text-white",error:"bg-red-500 text-white",warning:"bg-yellow-500 text-black",info:"bg-blue-500 text-white"};n.className+=` ${s[t]||s.info}`;const o={success:"fas fa-check-circle",error:"fas fa-exclamation-circle",warning:"fas fa-exclamation-triangle",info:"fas fa-info-circle"};n.innerHTML=`
        <div class="flex items-center space-x-2">
            <i class="${o[t]||o.info}"></i>
            <span>${e}</span>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>{n.classList.remove("translate-x-full")},100),setTimeout(()=>{n.classList.add("translate-x-full"),setTimeout(()=>{document.body.removeChild(n)},300)},5e3)}function xe(){G(),K();const e=document.getElementById("agentDetails");e&&(e.innerHTML=`
            <div class="text-center text-gray-500 py-6 md:py-8">
                <i class="fas fa-user-circle text-4xl md:text-6xl mb-3 md:mb-4"></i>
                <p class="text-sm md:text-base">Sélectionnez un agent pour voir ses détails</p>
            </div>
        `);const t=document.getElementById("yearFilter");t&&(t.innerHTML=`
            <option value="">Sélectionnez un agent</option>
        `),N=null}window.voirDetails=ge;window.refreshDashboard=xe;function p(e,t="info"){const n={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"},s=document.createElement("div");s.className=`${n[t]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.remove()},4e3)}const w=document.getElementById("pcStartDate"),C=document.getElementById("pcEndDate"),A=document.getElementById("pcNumDays"),Y=document.getElementById("pcAddCongeBtn");let k="";function M(e){k=e}function Q(){if(!w||!C||!A)return;const e=new Date(w.value),t=new Date(C.value);if(e.toString()!=="Invalid Date"&&t.toString()!=="Invalid Date"&&t>=e){const n=t-e,s=Math.floor(n/(1e3*60*60*24))+1;A.textContent=s}else A.textContent=0}w&&C&&(w.addEventListener("change",Q),C.addEventListener("change",Q));async function Ee(e){try{const t=`${h}/suivi-conge/jours-restants?reference=${encodeURIComponent(e)}`,n=await fetch(t),s=await n.json();if(!n.ok)throw new Error(s.message||"Impossible de récupérer les jours restants");const o=document.getElementById("pcJoursRestants");o&&(o.textContent=s.joursRestants??"--")}catch(t){console.error("Erreur fetch jours restants:",t);const n=document.getElementById("pcJoursRestants");n&&(n.textContent="--")}}Y&&Y.addEventListener("click",async()=>{const e=document.getElementById("pcMatricule"),t=document.getElementById("pcJoursRestants");if(!e||!t){p("❌ Éléments manquants dans le DOM","error");return}const n=e.textContent.trim(),s=w.value,o=C.value,a=parseInt(A.textContent,10),l=parseInt(t.textContent,10);if(!k){p("⚠️ Référence de congé invalide.","info");return}if(!n||n==="--"){p("⚠️ Matricule agent introuvable.","error");return}if(!s||!o){p("⚠️ Veuillez choisir la période.","error");return}if(!a||a<=0){p("⚠️ Nombre de jours invalide.","error");return}if(a>l){p(`⚠️ Vous demandez ${a} jours alors qu'il ne reste que ${l} jours.`,"error");return}const m={matricule:n,congeRef:k,dateDebut:s,dateFin:o,jours:a};try{const g=await fetch(`${h}/suivi-conge`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)}),i=await g.json();if(!g.ok){const y=i.message||"Erreur lors de l'ajout du congé";throw new Error(`❌ ${y}`)}p(`✅ Congé ajouté avec succès (ID: ${i.id})`,"success"),w.value="",C.value="",A.textContent="0",await Ee(k)}catch(g){p("error.message"+g.message,"error")}});function R(e,t="info"){const n={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"},s=document.createElement("div");s.className=`${n[t]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.remove()},4e3)}const te=document.getElementById("refNumber"),ne=document.getElementById("year"),we=document.getElementById("checkBtn"),x=document.getElementById("result"),se=document.getElementById("retourBtn"),I=document.getElementById("popupCongeOverlay"),Ce=document.getElementById("popupCloseBtn"),Ie=document.getElementById("popupDecisionNumber"),B=document.getElementById("popupNom"),D=document.getElementById("popupPrenom"),v=document.getElementById("popupMatricule"),oe=document.getElementById("popupJoursConges"),Le=document.getElementById("popupConfirmerBtn"),$e=document.getElementById("popupAnnulerBtn"),Be=document.getElementById("manageLeaves"),De=document.getElementById("priseCongeSection");let re="",ae="",H="";function Ae(){I.classList.remove("hidden"),I.classList.add("flex"),H=`${re}/DRH/${ae}`,Ie.value=H}function J(){I.classList.add("hidden"),I.classList.remove("flex")}function ce(){v.value="",oe.value="0",B.value="",D.value=""}function ie(){document.querySelectorAll("#dashboard, #addAgent, #priseCongeSection").forEach(e=>e.classList.add("hidden")),Be.classList.remove("hidden"),te.value="",ne.value="2025",x.innerHTML="",se.classList.add("hidden")}function le(e){document.querySelectorAll("#dashboard, #manageLeaves, #addAgent").forEach(t=>t.classList.add("hidden")),De.classList.remove("hidden"),je(e)}async function de(e){if(!e.trim()){B.value="",D.value="";return}try{const t=await fetch(`${h}/agent/nomPrenom?matricule=${encodeURIComponent(e)}`);if(t.ok){const n=await t.json();B.value=n.nom||"",D.value=n.prenom||""}else B.value="",D.value=""}catch(t){B.value="",D.value="",console.error(t)}}async function je(e){try{const t=await fetch(`${h}/agent/byConge?ref=${encodeURIComponent(e)}`);if(!t.ok)throw new Error("Agent non trouvé");const n=await t.json(),s=n.agent,o=n.jours??0,m=(await(await fetch(`${h}/suivi-conge/jours-restants?reference=${encodeURIComponent(e)}`)).json()).joursRestants??0;document.getElementById("pcRefConge").textContent=e,document.getElementById("pcMatricule").textContent=s.matricule??"-",document.getElementById("pcNom").textContent=s.nom??"-",document.getElementById("pcPrenom").textContent=s.prenom??"-",document.getElementById("pcFonction").textContent=s.fonction??"-",document.getElementById("pcJoursAttribues").textContent=o,document.getElementById("pcJoursRestants").textContent=m,typeof M=="function"&&M(e)}catch(t){console.error("Erreur récupération infos congé:",t),document.getElementById("pcRefConge").textContent=e,document.getElementById("pcMatricule").textContent="-",document.getElementById("pcNom").textContent="-",document.getElementById("pcPrenom").textContent="-",document.getElementById("pcFonction").textContent="-",document.getElementById("pcJoursAttribues").textContent="0",document.getElementById("pcJoursRestants").textContent="0",typeof M=="function"&&M(e)}}we.addEventListener("click",async()=>{const e=te.value.trim(),t=ne.value.trim();if(!e||!t){x.innerHTML=`<span class="text-red-600">Veuillez entrer le numéro et l'année.</span>`;return}re=e,ae=t;const n=`${e}/DRH/${t}`;try{const s=await fetch(`${h}/conge/checkRef?refNumber=${e}&year=${t}`),o=await s.text();s.ok?(x.innerHTML=`<span class="text-green-600">Référence trouvée : <b>${n}</b></span>`,setTimeout(()=>le(n),500)):(x.innerHTML=`<span class="text-red-600">${o}</span>`,setTimeout(Ae,300))}catch(s){x.innerHTML=`<span class="text-red-600">Erreur: ${s.message}</span>`}});se.addEventListener("click",ie);document.getElementById("retourPriseCongeBtn").addEventListener("click",ie);Ce.addEventListener("click",J);I.addEventListener("click",e=>{e.target===I&&J()});$e.addEventListener("click",()=>{ce(),J()});Le.addEventListener("click",async()=>{const e=v.value.trim(),t=parseInt(oe.value)||0;if(!e)return R("Veuillez saisir un matricule.","info");if(t<=0)return R("Nombre de jours invalide.","info");const n={reference:H,matriculeAgent:e,jours:t};try{const s=await fetch(`${h}/conge`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}),o=await s.json();if(s.ok)J(),ce(),x.innerHTML='<span class="text-green-600">Congé créé avec succès !</span>',setTimeout(()=>le(H),500);else{const a=o.message||"Erreur lors de la création du congé";R("❌ ${message}","error")}}catch(s){R(`Erreur de connexion : ${s.message}`,"error")}});v.addEventListener("input",e=>{clearTimeout(v.searchTimeout),v.searchTimeout=setTimeout(()=>{de(e.target.value.trim())},500)});v.addEventListener("blur",()=>de(v.value.trim()));function j(e,t="info"){const n={success:"bg-green-500",error:"bg-red-500",info:"bg-blue-500"},s=document.createElement("div");s.className=`${n[t]} text-white px-4 py-2 rounded-lg shadow-lg fixed top-4 right-4 z-50 animate-bounce`,s.textContent=e,document.body.appendChild(s),setTimeout(()=>{s.remove()},4e3)}const L=document.getElementById("agentNom"),$=document.getElementById("agentPrenom"),f=document.getElementById("agentMatricule"),T=document.getElementById("agentFonction"),E=document.getElementById("addAgentBtn"),_=document.getElementById("cancelBtn");let O=!1;function ue(){L&&(L.value=""),$&&($.value=""),f&&(f.value=""),T&&(T.value="")}function Te(e){j(`⌫ ${e}`,"error")}function Se(){const e=L?.value.trim(),t=$?.value.trim(),n=f?.value.trim(),s=T?.value.trim();return!e||!t||!n||!s?(j("Veuillez remplir tous les champs","info"),!1):n.length<3?(j("Le matricule doit contenir au moins 3 caractères","info"),f?.focus(),!1):!0}async function Z(){if(O||!Se())return;const e={matricule:f.value.trim().toUpperCase(),nom:L.value.trim(),prenom:$.value.trim(),fonction:T.value.trim()};try{O=!0,E.disabled=!0,E.textContent="Ajout en cours...";const t=await fetch(`${h}/agent`,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json"},body:JSON.stringify(e)});if(!t.ok){let s="Erreur lors de l'ajout de l'agent";try{s=(await t.json()).message||s}catch{t.status===415?s="Format de données non supporté":t.status===400?s="Données invalides":t.status===409?s="Le matricule existe déjà":s=`Erreur ${t.status}: ${t.statusText}`}throw new Error(s)}const n=await t.json();j(`Agent enregistré avec succès !
Matricule: ${n.matricule}
Nom complet: ${n.prenom} ${n.nom}`,"success"),ue()}catch(t){console.error("Erreur lors de l'ajout de l'agent:",t),Te(t.message||"Erreur de connexion au serveur")}finally{O=!1,E.disabled=!1,E.textContent="Ajouter"}}document.addEventListener("DOMContentLoaded",()=>{E&&E.addEventListener("click",e=>{e.preventDefault(),Z()}),_&&_.addEventListener("click",e=>{e.preventDefault(),ue(),j("Formulaire réinitialisé","success")}),f&&f.addEventListener("input",e=>{e.target.value=e.target.value.toUpperCase(),e.target.value=e.target.value.replace(/[^A-Z0-9]/g,"")}),[L,$].forEach(e=>{e&&e.addEventListener("input",t=>{t.target.value=t.target.value.replace(/[0-9]/g,""),t.target.value=t.target.value.replace(/\b\w/g,n=>n.toUpperCase())})}),[L,$,f,T].forEach(e=>{e&&e.addEventListener("keypress",t=>{t.key==="Enter"&&(t.preventDefault(),Z())})})});
