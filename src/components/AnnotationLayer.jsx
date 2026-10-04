/** Capa DOM de anotaciones proyectadas. aria-hidden: su contenido ya está en los subtítulos HTML. */
import { ANCHORS } from '../three/anchors';
import { annotationEls } from './annotationRegistry';

export function AnnotationLayer() {
  const reg = (id) => (el) => { if (el) annotationEls.set(id, el); else annotationEls.delete(id); };
  return (
    <div className="annotations js-only" aria-hidden="true">
      {ANCHORS.map((a) => (
        <div key={a.id} ref={reg(a.id)} className={`anno anno--${a.kind}`} data-dir={a.dir}>
          {a.kind === 'point' && (<><span className="anno__lead" /><span className="anno__dot" /><span className="anno__label">{a.label}</span></>)}
          {a.kind === 'tag' && (<><span className="anno__dot" /><span className="anno__label">{a.label}</span></>)}
          {a.kind === 'level' && (<><span className="anno__line" /><span className="anno__tick" /><span className="anno__label">{a.label}</span></>)}
          {a.kind === 'force' && (<><span className="anno__shaft" /><span className="anno__head" /></>)}
        </div>
      ))}
    </div>
  );
}
