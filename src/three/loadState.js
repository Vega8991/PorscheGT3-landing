// Señales de carga del 3D compartidas entre el escenario y la intro del hero.
let resolveModel;
export const modelReady = new Promise((r) => { resolveModel = r; });
export const markModelReady = () => resolveModel?.(true);
