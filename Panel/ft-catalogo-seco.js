// ============================================================
// Catálogo de hongo SECO — Transformación (v1, 22 oct 2026)
// Fuente: "HONGOS SECOS.xlsx" → hoja STOCK ACTUALIZADO.
// Cada especie: nombre común (el que usa el cotizador cuando existe),
// nombre científico, uso, tratamiento, combinaciones calidad·corte que
// aparecen en la bitácora, y alias (cómo puede venir escrito en Drive).
// La fase 3 (traer de Drive) usará este mismo catálogo para traducir.
// ============================================================
(function(){
  const C=(comun,cientifico,uso,trat,combos,alias)=>({comun,cientifico,uso,trat,combos,alias:alias||[]});
  const CATALOGO_SECO=[
    // ── Comestibles ──
    C("Champiñón Blanco","Agaricus bisporus","Comestible","Compost",[["1ra","Rebanadas"],["1ra","Entera"],["1ra","Cortada en cuadros"]],["agaricus bisporus","champinon"]),
    C("Champiñón de Campo","Agaricus campestris","Comestible","Compost",[["1ra","Cortada en cuadros"]],["agaricus campestris"]),
    C("Agaricus fissuratus","Agaricus fissuratus","Comestible","Compost",[["1ra","Cortada en cuadros"]],["agaricus fissuratus"]),
    C("Piopino","Agrocybe aegerita","Comestible","Estéril",[["1ra","Entera"]],["agrocybe aegerita","pioppino"]),
    C("Auricularia","Auricularia sp.","Comestible","Estéril",[["1ra","Entera"]],["auricularia sp","auricularia","oreja de raton"]),
    C("Hongo Barbuda","Coprinus comatus","Comestible","Compost",[["1ra","Entera"]],["coprinus comatus","barbuda"]),
    C("Enoki filiformis","Flammulina filiformis","Comestible","Estéril",[["1ra","Entera"]],["flammulina filiformis"]),
    C("Enokitake Golden","Flammulina velutipes","Comestible","Estéril",[["1ra","Entera"],["2da","Entera"]],["flammulina velutipes","enoki","enokitake"]),
    C("Maitake","Grifola frondosa","Comestible","Estéril",[["1ra","Entera"]],["grifola frondosa"]),
    C("Buna Shimeji","Hypsizygus tessulatus","Comestible","Estéril",[["1ra","Entera"]],["hypsizygus tessulatus","hipzizigus tessulatus","hipsizigus tessulatus","ht"]),
    C("Bunapi Shimeji","Hypsizygus tessulatus (blanca)","Comestible","Estéril",[["1ra","Entera"]],["ht (blanca)","ht blanca","hypsizygus tessulatus blanca"]),
    C("Laetiporus","Laetiporus sp.","Comestible","Estéril",[["1ra","Entera"]],["laetiporus","pollo del bosque"]),
    C("Leucoagaricus","Leucoagaricus sp.","Comestible","Estéril",[["1ra","Entera"]],["leucoagaricus"]),
    C("Phallus hadriani","Phallus hadriani","Comestible","",[["1ra","Entera"]],["phallus hadriani","phallus"]),
    C("Hongo de Pino","Neolentinus ponderosus","Comestible","Estéril",[["1ra","Rebanadas"],["2da","Trozos"]],["neolentinus ponderosus"]),
    C("Chestnut","Pholiota adiposa","Comestible","Estéril",[["1ra","Entera"]],["pholiota adiposa"]),
    C("Nameko","Pholiota nameko","Comestible","Estéril",[["1ra","Entera"]],["pholiota nameko"]),
    C("Seta de Agave","Pleurotus agaves","Comestible","Estéril",[["1ra","Entera"]],["pleurotus agaves"]),
    C("Seta Amarilla","Pleurotus citrinopileatus","Comestible","Estéril",[["1ra","Entera"]],["pleurotus citrino","pleurotus citrinopileatus"]),
    C("Seta Rosa albina","Pleurotus djamor (albina)","Comestible","Estéril",[["1ra","Entera"]],["pleurotus djamor (albina)","pleurotus djamor albina"]),
    C("Seta Rosa","Pleurotus djamor","Comestible","Compost",[["1ra","Entera"]],["pleurotus djamor"]),
    C("Seta de Cardo","Pleurotus eryngii","Comestible","Estéril",[["1ra","Rebanadas"],["2da","Primordios"]],["pleurotus eryngii"]),
    C("Seta Pleurotus","Pleurotus ssp.","Comestible","Compost",[["1ra","Entera"],["3ra","Para moler"]],["pleurotus ssp","pleurotus sp","seta ostreatus","seta"]),
    C("Portobello","Agaricus bisporus (portobello)","Comestible","Estéril",[["1ra","Rodajas"],["1ra","Cortada en cuadros"]],["portobello"]),
    C("Morilla","Morchella sp.","Comestible","",[["1ra","Entera"]],["morquella","morchella","morilla"]),
    // ── Medicinales ──
    C("Cordyceps","Cordyceps militaris","Medicinal","Arroz estéril",[["1ra","Entera"]],["cordyceps","cordyceps militaris"]),
    C("Cordyceps (pan)","Cordyceps militaris (pan)","Medicinal","Arroz estéril",[["3ra","Rebanadas"]],["cordyceps (pan)","cordyceps pan","pan de cordy"]),
    C("Reishi G1","Ganoderma G1","Medicinal","Estéril",[["1ra","Entera"]],["ganoderma g1","ganoderma g1."]),
    C("Reishi","Ganoderma sp.","Medicinal","Estéril",[["1ra","Trozos"],["2da","Para moler"]],["ganoderma sp","ganoderma","reishi"]),
    C("Melena de León","Hericium erinaceus","Medicinal","Estéril",[["1ra","Rebanadas"],["2da","Entera"]],["hericium erinaceus","melena de leon"]),
    C("Shiitake","Lentinula edodes","Medicinal","Estéril",[["1ra","Entera"],["2da","Para moler"]],["lentinula edodes"]),
    C("Trametes sanguineus","Trametes sanguineus","Medicinal","Estéril",[["1ra","Entera"]],["trametes sanguineus"]),
    C("Cola de Pavo","Trametes versicolor","Medicinal","Estéril",[["1ra","Trozos"],["3ra","Para moler"]],["trametes versicolor"]),
    C("Schizophyllum commune","Schizophyllum commune","Medicinal","",[["1ra","Entera"]],["schizophyllum commune","schizophyllum"])
  ];

  const CALIDADES_SECO=["1ra","2da","3ra"];
  const CORTES_SECO=["Entera","Rebanadas","Cortada en cuadros","Trozos","Rodajas","Para moler","Primordios","Polvo"];

  // Quita acentos, puntos, mayúsculas y espacios dobles para comparar.
  function normalizar(t){
    return String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"")
      .toLowerCase().replace(/[.]/g,"").replace(/\s+/g," ").trim();
  }

  // Traducción de cómo viene escrito en la bitácora → valor del sistema.
  const CALIDAD_ALIAS={primera:"1ra","1ra":"1ra",segunda:"2da","2da":"2da",tercera:"3ra","3ra":"3ra"};
  function traducirCalidad(t){ return CALIDAD_ALIAS[normalizar(t)]||""; }
  function traducirCorte(t){
    const n=normalizar(t);
    if(!n) return "";
    if(/primordio/.test(n)) return "Primordios";
    if(/cuadro/.test(n)) return "Cortada en cuadros";
    if(/rebanad/.test(n)) return "Rebanadas";
    if(/rodaja/.test(n)) return "Rodajas";
    if(/trozo/.test(n)) return "Trozos";
    if(/moler|estipite/.test(n)) return "Para moler";
    if(/polvo/.test(n)) return "Polvo";
    if(/enter/.test(n)) return "Entera";
    return "";
  }

  // Encuentra la especie por nombre común, científico o alias.
  function buscarEspecie(t){
    const n=normalizar(t);
    if(!n) return null;
    return CATALOGO_SECO.find(e=>normalizar(e.comun)===n||normalizar(e.cientifico)===n||e.alias.some(a=>normalizar(a)===n))||null;
  }

  // Nombre con el que se guarda en el inventario.
  function nombreSeco(comun,corte,calidad){
    return comun+" — Seco · "+corte+" · "+calidad;
  }

  // Lee un nombre de inventario y dice qué es. Reconoce el formato nuevo
  // ("Shiitake — Seco · Entera · 1ra") y los anteriores ("Shiitake — Seco (rebanado)",
  // "Shiitake — Fresco", "Shiitake — Fungisopa").
  function leerNombre(nombre){
    const s=String(nombre||"");
    const m=s.match(/^(.+?)\s+—\s+Seco\s+·\s+(.+?)\s+·\s+(1ra|2da|3ra)$/);
    if(m){
      const esp=buscarEspecie(m[1]);
      return {tipo:"Seco",especie:m[1],corte:m[2],calidad:m[3],uso:esp?esp.uso:"",cientifico:esp?esp.cientifico:"",trat:esp?esp.trat:""};
    }
    const p=s.match(/^(.+?)\s+—\s+(.+)$/);
    const especie=p?p[1]:s;
    const resto=p?p[2]:"";
    const esp=buscarEspecie(especie);
    let tipo="Otro";
    if(/fungisopa/i.test(resto)||/fungisopa/i.test(especie)) tipo="Fungisopa";
    else if(/seco|deshidrat/i.test(resto)) tipo="Seco";
    else if(/fresco/i.test(resto)) tipo="Fresco";
    return {tipo,especie,corte:tipo==="Seco"?traducirCorte(resto):"",calidad:"",uso:esp?esp.uso:"",cientifico:esp?esp.cientifico:"",trat:esp?esp.trat:""};
  }

  // Fase 3: lee la hoja STOCK ACTUALIZADO tal como viene de Drive.
  // Devuelve {mes, filas:[{etiqueta, producto|null, cantidad}]}.
  // mes = la última columna de mes que tenga algún número (el conteo vigente).
  function numero(t){
    const s=String(t==null?"":t).trim().replace(/\s/g,"");
    if(!s) return null;
    const n=Number(/,/.test(s)&&!/\./.test(s)?s.replace(",","."):s.replace(/,/g,""));
    return isNaN(n)?null:n;
  }
  function leerBitacora(valores){
    const filas=valores||[];
    const h=filas.findIndex(r=>r.some(c=>normalizar(c)==="especie"));
    if(h<0) return {mes:"",filas:[],error:"No encontré el encabezado ESPECIE en la hoja"};
    const enc=filas[h].map(normalizar);
    const col=n=>enc.indexOf(n);
    const cUso=col("uso"),cEsp=col("especie"),cCal=col("calidad"),cEst=col("estado"),cTra=col("tratamiento");
    const datos=filas.slice(h+1).filter(r=>normalizar(r[cEsp])!=="especie");
    const desde=Math.max(cUso,cEsp,cCal,cEst,cTra)+1;
    let cMes=-1;
    for(let c=filas[h].length-1;c>=desde;c--){
      if(String(filas[h][c]||"").trim() && datos.some(r=>numero(r[c])!==null)){ cMes=c; break; }
    }
    if(cMes<0) return {mes:"",filas:[],error:"No encontré ninguna columna de mes con números"};
    const salida=[];
    for(const r of datos){
      const a=r[cUso]||"",b=r[cEsp]||"",c=r[cCal]||"",d=r[cEst]||"";
      const cant=numero(r[cMes]);
      if(cant===null) continue;           // sin conteo ese mes: no se toca
      const etiqueta=[a,b,c,d].map(x=>String(x).trim()).filter(Boolean).join(" · ");
      if(!etiqueta) continue;
      let producto=null;
      if(/fungisopa/i.test(b)||/fungisopa/i.test(c)){
        const e=buscarEspecie(a);
        if(e) producto=e.comun+" — Fungisopa";
      }else{
        const e=buscarEspecie(b);
        let cal=traducirCalidad(c),corte=traducirCorte(d);
        if(e&&(!cal||!corte)&&e.combos.length===1){ cal=cal||e.combos[0][0]; corte=corte||e.combos[0][1]; }
        if(e&&cal&&corte) producto=nombreSeco(e.comun,corte,cal);
      }
      salida.push({etiqueta,producto,cantidad:cant});
    }
    return {mes:String(filas[h][cMes]).trim(),filas:salida};
  }

  window.FT_SECO={CATALOGO_SECO,CALIDADES_SECO,CORTES_SECO,normalizar,traducirCalidad,traducirCorte,buscarEspecie,nombreSeco,leerNombre,leerBitacora};
})();
