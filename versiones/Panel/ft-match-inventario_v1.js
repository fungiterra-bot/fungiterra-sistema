// ============================================================
// Reconocer productos de un pedido en el inventario del área (v1, 22 oct 2026)
// Antes: solo coincidía si el nombre era idéntico. El cotizador escribe
// "Shiitake — Micelio (kg)" y el inventario "Shiitake — Micelio", así que
// casi nunca aparecía "Usar del inventario".
// Ahora: 1) nombre idéntico; 2) misma especie + mismo tipo, sin importar
// acentos, mayúsculas, unidades o paréntesis. Si hay varias opciones
// (ej. seco 1ra entera y 2da para moler), el panel deja elegir.
// Usado por FungiBolsa, Laboratorio, Transformación e Insumos/Piopis.
// ============================================================
(function(){
  function normalizar(t){
    return String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"")
      .toLowerCase().replace(/[.]/g,"").replace(/\s+/g," ").trim();
  }

  function tipoCanonico(resto){
    const n=normalizar(resto);
    if(!n) return "";
    if(/fungisopa/.test(n)) return "fungisopa";
    if(/fresco/.test(n)) return "fresco";
    if(/seco|deshidrat|polvo/.test(n)) return "seco";
    if(/mushbag/.test(n)) return /(^|\D)3\s*kg/.test(n)?"mushbag 3kg":"mushbag 15kg";
    if(/micelio/.test(n)) return "micelio";
    if(/cepa|petri/.test(n)) return "cepa";
    if(/extracto/.test(n)) return "extracto";
    // Otros (FungiBolsa, insumos): el texto sin paréntesis ni unidades
    return n.replace(/\(.*?\)/g," ").replace(/\b\d+(\s*\d+)?\s*(kg|g|gr|pz|pzas?)\b/g," ").replace(/\s+/g," ").trim();
  }

  function especieCanonica(esp){
    if(window.FT_SECO){
      const e=window.FT_SECO.buscarEspecie(esp);
      if(e) return normalizar(e.comun);
    }
    return normalizar(esp);
  }

  // Clave "especie|tipo" de un nombre de producto.
  function clave(nombre){
    const s=String(nombre||"");
    const i=s.indexOf(" — ");
    if(i<0) return normalizar(s)+"|";
    return especieCanonica(s.slice(0,i))+"|"+tipoCanonico(s.slice(i+3));
  }

  function calidadDe(nombre){
    const m=String(nombre||"").match(/·\s*(1ra|2da|3ra)\s*$/);
    return m?m[1]:"";
  }

  // Lista de productos del inventario (con existencia) que sirven para
  // el producto del pedido. El idéntico va primero; luego 1ra, 2da, 3ra,
  // y a igual calidad el que más existencia tenga.
  function candidatos(nombrePedido,inventario){
    const conStock=(inventario||[]).filter(i=>Number(i.cantidad_actual)>0);
    const exacto=conStock.find(i=>i.producto===nombrePedido);
    const k=clave(nombrePedido);
    const parecidos=conStock.filter(i=>i!==exacto && clave(i.producto)===k);
    const rango=n=>({"1ra":1,"2da":2,"3ra":3}[calidadDe(n)]||0);
    parecidos.sort((a,b)=>rango(a.producto)-rango(b.producto)||Number(b.cantidad_actual)-Number(a.cantidad_actual));
    return exacto?[exacto,...parecidos]:parecidos;
  }

  window.FT_MATCH={normalizar,clave,tipoCanonico,candidatos};
})();
