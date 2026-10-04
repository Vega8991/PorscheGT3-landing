// Registro único de GSAP y plugins (gratuitos desde 3.13).
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
ScrollTrigger.config({ ignoreMobileResize: true });
if (typeof window !== 'undefined') {
  const q = new URLSearchParams(location.search);
  if (q.has('debug')) { window.__ST = ScrollTrigger; window.__gsap = gsap; }
  if (q.has('nolag')) gsap.ticker.lagSmoothing(0); // pruebas en GPU por software
}

export { gsap, ScrollTrigger, SplitText, useGSAP };
