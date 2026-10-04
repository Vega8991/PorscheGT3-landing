// Anclajes de las anotaciones proyectadas. `key` = propiedad del director que controla su opacidad.
// Solo se señala una pieza cuando el texto de la escena habla de ella.
const P = 'TwiXeR_992_';

export const ANCHORS = [
  // FORM
  { id: 'a_splitter', key: 'a_splitter', kind: 'point', node: `${P}gt3rs_bumper_F`, frac: [0.5, 0.04, 0.98], label: 'Splitter', dir: 'se' },
  { id: 'a_nostrils', key: 'a_nostrils', kind: 'point', node: `${P}gt3rs_carbon_hood_${P}metal_radiator.002_0`, frac: [0.5, 1, 0.5], label: 'Nostrils', dir: 'ne' },
  { id: 'a_louvres', key: 'a_louvres', kind: 'point', node: `${P}gt3rs_fender_L_${P}metal_radiator.002_0`, frac: [0.5, 1, 0.5], label: 'Louvres', dir: 'ne' },
  { id: 'a_carbon', key: 'a_carbon', kind: 'point', node: `${P}gt3rs_carbon_roof`, frac: [0.6, 1, 0.5], label: 'CFRP roof', dir: 'ne' },
  { id: 'a_roofline', key: 'a_roofline', kind: 'level', node: `${P}gt3rs_carbon_roof`, frac: [0.5, 1, 0.5], node2: `${P}gt3rs_carbon_Wing`, frac2: [0.5, 1, 0.3], label: 'Roofline' },
  // AERO — carga aerodinámica (sin reparto por eje: no lo publicamos porque no está verificado)
  { id: 'f_front', key: 'force', kind: 'force', node: `${P}gt3rs_carbon_hood`, frac: [0.5, 1, 0.45] },
  { id: 'f_rear', key: 'force', kind: 'force', node: `${P}gt3rs_carbon_Wing`, frac: [0.5, 1, 0.5] },
  // WING
  { id: 'a_neck', key: 'a_neck', kind: 'point', node: `${P}gt3rs_left_leg`, frac: [0.5, 0.45, 0.5], label: 'Swan neck', dir: 'se' },
  { id: 'a_drs', key: 'a_drs', kind: 'point', node: `${P}gt3rs_carbon_Wing_${P}carbon_roof.001_0`, frac: [0.85, 1, 0.5], label: 'DRS element', dir: 'ne' },
  // WHEELS
  { id: 'a_disc', key: 'a_disc', kind: 'point', node: 'amdb11_brakedisc_FR.003_amdb11_brake.002_0', follow: 'corner_FL', frac: [0.5, 0.92, 0.85], label: 'Disc', dir: 'ne' },
  { id: 'a_caliper', key: 'a_caliper', kind: 'point', node: 'amdb11_brakedisc_FR.003_amdb11_caliper.002_0', follow: 'corner_FL', frac: [0.6, 0.75, 0.5], label: 'Calliper', dir: 'nw' },
  // COCKPIT
  { id: 'a_wheel', key: 'a_wheel', kind: 'point', node: `${P}steer_3`, frac: [0.85, 0.75, 0.5], label: 'Rotary controls', dir: 'ne' },
  { id: 'a_gauges', key: 'a_gauges', kind: 'point', node: `${P}dash_9000_${P}gauges_9000.001_0`, frac: [0.5, 0.7, 0.5], label: 'Rev counter', dir: 'ne' },
  { id: 'a_seat', key: 'a_seat', kind: 'point', node: `${P}seat_FL`, frac: [0.5, 0.9, 0.3], label: 'Bucket seat', dir: 'nw' },
  // EXPLODED — etiquetas de capa
  { id: 'g_glass', key: 'g_tags', kind: 'tag', node: `${P}windshield`, frac: [0.5, 1, 0.5], label: '01 Glass' },
  { id: 'g_body', key: 'g_tags', kind: 'tag', node: `${P}body_gt3rs`, frac: [0.95, 0.9, 0.2], label: '02 Body' },
  { id: 'g_aero', key: 'g_tags', kind: 'tag', node: `${P}gt3rs_carbon_Wing`, frac: [0.95, 1, 0.5], label: '03 Aerodynamics' },
  { id: 'g_wheels', key: 'g_tags', kind: 'tag', node: 'corner_FL', frac: [0.9, 0.9, 0.5], label: '04 Wheels' },
  { id: 'g_interior', key: 'g_tags', kind: 'tag', node: `${P}seat_FL`, frac: [0.9, 1, 0.5], label: '05 Interior' },
  { id: 'g_chassis', key: 'g_tags', kind: 'tag', node: `${P}subframe_F`, frac: [0.95, 0.5, 0.5], label: '06 Chassis' },
  { id: 'g_mech', key: 'g_tags', kind: 'tag', node: `${P}engine`, frac: [0.95, 0.3, 0.5], label: '07 Mechanical' },
];
