import React from "react";

export default function Aside() {
  return (
    <aside className="sm:hidden no-scrollbar">
      <h3>Información adicional</h3>
      <ul>
        <li>Noticias de anime</li>
        <li>Recomendaciones</li>
        <li>Enlaces útiles</li>
      </ul>
    </aside>
  );
}
