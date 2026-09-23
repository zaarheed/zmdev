import { useEffect, useMemo, useRef, useState } from "react";

// Every project logo drifting on its own loose orbit around the hero text:
// pure decoration, deliberately a little chaotic. Each logo has its own
// distance, tilt, centre, size and direction; it surges and slows, grows and
// shrinks, its path breathes in and out, and it bobs and wobbles, all on
// rhythms of its own, so nothing looks choreographed. The businesses
// (Foundering) tend to stay closer in.
//
// Every logo is the same height with its width worked out from its real
// shape. Icons are trimmed of see-through padding first, so a wide badge in a
// square file still comes out wide. New projects join automatically.
//
// The orbits are sized from the text they circle, so nothing shows until the
// script has placed every logo. Logos at the back are smaller and dimmer, and
// any logo that drifts over the text fades so the name always reads.
//
// The opening: once the name has risen in, the logos pop into a tight, messy
// heap where the tagline sits, tremble, then burst. Each one shoots out on an
// underdamped spring, overshoots its orbit, spins out and swings back in. The
// burst is what reveals the tagline (onReveal).

const FURTHEST = 1.85;          // widest reach of any orbit, relative to the base
const ASPECT = [0.45, 2.4];     // narrowest and widest a logo may be, width / height
const TAU = Math.PI * 2;

const INTRO_AT_MS = 750;        // earliest the heap starts, from page load
const GATHER_MS = 450;          // logos pop into the heap
const TREMBLE_MS = 760;         // the heap shakes, building up, before it goes
const SETTLE_S = 4;             // by now every logo has settled into orbit

// Underdamped step from 0 to 1: shoots past 1, swings back, settles.
function spring(t, zeta, omega) {
	if (t <= 0) return 0;
	const wd = omega * Math.sqrt(1 - zeta * zeta);
	return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
}
const easeOutBack = (k) => 1 + 2.9 * Math.pow(k - 1, 3) + 1.9 * Math.pow(k - 1, 2);
const smooth = (k) => k * k * (3 - 2 * k);
const clamp01 = (k) => Math.min(1, Math.max(0, k));

// A small seeded random, so every visit starts from the same scatter.
function seeded(seed) {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let r = Math.imul(s ^ (s >>> 15), 1 | s);
		r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
		return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
	};
}

const clampAspect = (aspect) => Math.min(ASPECT[1], Math.max(ASPECT[0], aspect || 1));

// Work out a logo's real shape. Raster icons are cropped to their visible
// pixels; SVGs take their shape from the viewBox.
async function shapeOf(src) {
	if (/\.svg($|\?)/i.test(src)) {
		try {
			const text = await (await fetch(src)).text();
			const box = text.match(/viewBox\s*=\s*["']\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
			if (box) return { src, aspect: clampAspect(parseFloat(box[1]) / parseFloat(box[2])) };
		} catch (error) {
			// fall back to a square below
		}
		return { src, aspect: 1 };
	}

	const img = new Image();
	img.src = src;
	try {
		await img.decode();
	} catch (error) {
		return { src, aspect: 1 };
	}
	const w = img.naturalWidth;
	const h = img.naturalHeight;
	if (!w || !h) return { src, aspect: 1 };

	// Find the visible pixels on a small copy.
	const scan = Math.min(1, 200 / Math.max(w, h));
	const sw = Math.max(1, Math.round(w * scan));
	const sh = Math.max(1, Math.round(h * scan));
	const probe = document.createElement("canvas");
	probe.width = sw;
	probe.height = sh;
	const context = probe.getContext("2d");
	context.drawImage(img, 0, 0, sw, sh);
	let pixels;
	try {
		pixels = context.getImageData(0, 0, sw, sh).data;
	} catch (error) {
		return { src, aspect: clampAspect(w / h) };
	}
	let left = sw;
	let top = sh;
	let right = -1;
	let bottom = -1;
	for (let y = 0; y < sh; y++) {
		for (let x = 0; x < sw; x++) {
			if (pixels[(y * sw + x) * 4 + 3] > 10) {
				if (x < left) left = x;
				if (x > right) right = x;
				if (y < top) top = y;
				if (y > bottom) bottom = y;
			}
		}
	}
	if (right < 0) return { src, aspect: clampAspect(w / h) };

	// Crop the original, with a pixel of slack for soft edges.
	const x0 = Math.max(0, (left - 1) / scan);
	const y0 = Math.max(0, (top - 1) / scan);
	const cw = Math.min(w, (right + 2) / scan) - x0;
	const ch = Math.min(h, (bottom + 2) / scan) - y0;
	if (cw >= w * 0.97 && ch >= h * 0.97) return { src, aspect: clampAspect(w / h) };

	const out = document.createElement("canvas");
	const k = Math.min(1, 384 / Math.max(cw, ch));
	out.width = Math.max(1, Math.round(cw * k));
	out.height = Math.max(1, Math.round(ch * k));
	out.getContext("2d").drawImage(img, x0, y0, cw, ch, 0, 0, out.width, out.height);
	const blob = await new Promise((resolve) => out.toBlob(resolve, "image/png"));
	if (!blob) return { src, aspect: clampAspect(cw / ch) };
	return { src: URL.createObjectURL(blob), aspect: clampAspect(cw / ch), made: true };
}

const byOrder = (a, b) =>
	(Number(a.order) || 999) - (Number(b.order) || 999) || String(a.title).localeCompare(String(b.title));

function arrange(projects) {
	const rand = seeded(20260923);
	const withIcons = projects.filter((project) => project.iconUrl);
	const businesses = withIcons.filter((project) => project.half === "foundering").sort(byOrder);
	const rest = withIcons.filter((project) => project.half !== "foundering").sort(byOrder);
	const all = [...businesses, ...rest];

	// Spread the starting points round the circle in a shuffled order, then
	// jitter them, so they begin scattered rather than bunched or evenly spaced.
	const shuffled = () => {
		const order = all.map((_, i) => i);
		for (let i = order.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[order[i], order[j]] = [order[j], order[i]];
		}
		return order;
	};
	const slots = shuffled();
	const heapOrder = shuffled();

	return all.map((project, i) => {
		const business = project.half === "foundering";
		const period = 26 + rand() * 84; // seconds a lap, at its average pace
		const surgePeriod = 9 + rand() * 16;
		return {
			project,
			reach: business ? 1 + rand() * 0.28 : 1.06 + rand() * 0.5,
			squash: 0.8 + rand() * 0.4,
			shiftX: (rand() - 0.5) * 0.14,
			shiftY: (rand() - 0.5) * 0.2,
			period,
			direction: rand() < 0.32 ? -1 : 1,
			phase: (TAU * slots[i]) / all.length + (rand() - 0.5) * 0.9,
			// Speeds up and slows down, between about 0.2x and 1.8x its pace,
			// but never enough to reverse.
			surge: { amount: ((0.35 + rand() * 0.45) * surgePeriod) / period, period: surgePeriod, phase: rand() * TAU },
			breathe: { amount: 0.03 + rand() * 0.11, period: 6 + rand() * 12, phase: rand() * TAU },
			pulse: { amount: 0.08 + rand() * 0.16, period: 4 + rand() * 8, phase: rand() * TAU },
			bob: { amount: 4 + rand() * 8, period: 2.6 + rand() * 3.4, phase: rand() * TAU },
			spin: { amount: 3 + rand() * 12, period: 4 + rand() * 9, phase: rand() * TAU },
			size: 0.72 + rand() * 0.6,
			intro: {
				order: heapOrder[i],
				angle: rand() * TAU,
				radius: Math.sqrt(rand()),
				tilt: (rand() - 0.5) * 70,
				spin: (rand() < 0.5 ? -1 : 1) * (220 + rand() * 440),
				zeta: 0.28 + rand() * 0.16,
				omega: 6.2 + rand() * 3,
				delay: rand() * 0.08,
			},
		};
	});
}

export default function Orbit({ projects = [], textRef, burstRef, onReveal }) {
	const items = useMemo(() => arrange(projects), [projects]);
	const [shapes, setShapes] = useState(null);
	const stageRef = useRef(null);
	const itemRefs = useRef([]);
	const revealRef = useRef(onReveal);

	useEffect(() => {
		revealRef.current = onReveal;
	});

	// Measure every logo's real shape before anything is placed.
	useEffect(() => {
		let cancelled = false;
		let made = [];
		Promise.all(items.map((item) => shapeOf(item.project.iconUrl))).then((result) => {
			made = result.filter((shape) => shape.made).map((shape) => shape.src);
			if (cancelled) {
				made.forEach((url) => URL.revokeObjectURL(url));
				return;
			}
			setShapes(result);
		});
		return () => {
			cancelled = true;
			made.forEach((url) => URL.revokeObjectURL(url));
		};
	}, [items]);

	useEffect(() => {
		const stage = stageRef.current;
		if (!stage || !shapes || !items.length) return undefined;

		const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const els = itemRefs.current.slice(0, items.length);
		let geo = null;
		let raf = 0;
		let last = 0;
		let t = 0;
		let visible = true;
		let startAt = null;
		let burstAt = null;
		let revealed = false;

		const reveal = () => {
			if (revealed) return;
			revealed = true;
			if (revealRef.current) revealRef.current();
		};

		// Base orbit from the text: on wide screens it clears the text's
		// corners. The widest orbit never runs past the screen edge, so on
		// narrow screens logos pass behind the text instead (where they fade),
		// and on portrait screens the orbits grow taller to use the height.
		const measure = () => {
			const box = stage.getBoundingClientRect();
			const text = textRef && textRef.current ? textRef.current.getBoundingClientRect() : null;
			const logo = els[0] ? els[0].offsetHeight : 56;
			const a = text ? text.width / 2 : box.width / 4;
			const b = text ? text.height / 2 : box.height / 6;
			geo = {
				cx: text ? text.left - box.left + a : box.width / 2,
				cy: text ? text.top - box.top + b : box.height / 2,
				rx: Math.min(a * Math.SQRT2 + logo * 0.75, (box.width * 0.47) / FURTHEST),
				ry: Math.max(b * Math.SQRT2 + logo * 0.75, box.height > box.width ? box.height * 0.2 : 0),
				text: text && {
					left: text.left - box.left - 12,
					top: text.top - box.top - 8,
					right: text.right - box.left + 12,
					bottom: text.bottom - box.top + 8,
				},
				sizes: els.map((el) => [el.offsetWidth, el.offsetHeight]),
			};
			// The heap is a tight clump over the middle of the tagline.
			const heap = burstRef && burstRef.current ? burstRef.current.getBoundingClientRect() : text;
			geo.heap = {
				x: heap ? heap.left - box.left + heap.width / 2 : geo.cx,
				y: heap ? heap.top - box.top + heap.height / 2 : geo.cy,
				rx: logo * 1.15,
				ry: logo * 0.6,
			};
		};

		const draw = (now) => {
			const since = startAt === null ? -1 : now - startAt;
			const tau = burstAt === null ? -1 : (now - burstAt) / 1000;
			items.forEach((item, i) => {
				const surge = item.surge.amount * Math.sin((TAU * t) / item.surge.period + item.surge.phase);
				const angle = item.phase + item.direction * ((TAU * t) / item.period + surge);
				const breathe = 1 + item.breathe.amount * Math.sin((TAU * t) / item.breathe.period + item.breathe.phase);
				const rx = geo.rx * item.reach * breathe;
				const ry = geo.ry * item.reach * item.squash * breathe;
				const depth = Math.sin(angle); // -1 at the back, +1 at the front
				const near = (depth + 1) / 2;
				const x = geo.cx + geo.rx * item.shiftX + rx * Math.cos(angle);
				const y = geo.cy + geo.ry * item.shiftY + ry * depth +
					Math.sin((TAU * t) / item.bob.period + item.bob.phase) * item.bob.amount;
				const pulse = 1 + item.pulse.amount * Math.sin((TAU * t) / item.pulse.period + item.pulse.phase);
				const scale = (0.68 + 0.44 * near) * item.size * pulse;
				const rotate = item.spin.amount * Math.sin((TAU * t) / item.spin.period + item.spin.phase);
				let opacity = 0.5 + 0.5 * near;

				if (geo.text) {
					const dx = Math.max(geo.text.left - x, 0, x - geo.text.right);
					const dy = Math.max(geo.text.top - y, 0, y - geo.text.bottom);
					opacity *= Math.min(1, 0.12 + Math.hypot(dx, dy) / 60);
				}

				let px = x;
				let py = y;
				let ps = scale;
				let pr = rotate;
				let po = opacity;
				let pz = 1 + Math.round(near * 100);

				if (!still && tau < SETTLE_S) {
					const intro = item.intro;
					const hx = geo.heap.x + Math.cos(intro.angle) * intro.radius * geo.heap.rx;
					const hy = geo.heap.y + Math.sin(intro.angle) * intro.radius * geo.heap.ry;
					const hs = 0.62 * item.size;
					if (tau < 0) {
						// Pop into the heap one by one, then tense and tremble.
						const k = clamp01((since - (intro.order / items.length) * (GATHER_MS - 180)) / 180);
						const tense = clamp01((since - GATHER_MS) / TREMBLE_MS);
						const shake = tense * 3.2;
						px = hx + Math.sin(now * 0.09 + i * 1.3) * shake;
						py = hy + Math.cos(now * 0.113 + i * 2.1) * shake;
						ps = k > 0 ? hs * easeOutBack(k) * (1 - 0.12 * smooth(tense)) : 0;
						pr = intro.tilt;
						po = k > 0 ? 1 : 0;
						pz = 150 + intro.order;
					} else {
						// Burst: spring from the heap to the orbit, spinning out.
						const since0 = Math.max(0, tau - intro.delay);
						const out = spring(since0, intro.zeta, intro.omega);
						const settle = smooth(clamp01(since0 / 1.1));
						px = hx + (x - hx) * out;
						py = hy + (y - hy) * out;
						ps = hs + (scale - hs) * out;
						pr = rotate + (intro.tilt + intro.spin) * Math.exp(-3 * since0);
						po = 1 + (opacity - 1) * settle;
						if (since0 < 0.2) pz = 150 + intro.order;
					}
				}

				const [w, h] = geo.sizes[i];
				els[i].style.transform = `translate3d(${px - w / 2}px, ${py - h / 2}px, 0) rotate(${pr}deg) scale(${ps})`;
				els[i].style.opacity = po;
				els[i].style.zIndex = pz;
			});
		};

		const frame = (now) => {
			raf = 0;
			if (startAt === null) startAt = Math.max(now, INTRO_AT_MS);
			if (burstAt === null && now - startAt >= GATHER_MS + TREMBLE_MS) {
				burstAt = startAt + GATHER_MS + TREMBLE_MS;
				reveal();
			}
			const dt = last ? Math.min(now - last, 64) / 1000 : 0;
			last = now;
			if (burstAt !== null) t += dt;
			draw(now);
			if (visible) raf = requestAnimationFrame(frame);
			else last = 0;
		};

		const seen = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible && !still && !raf) raf = requestAnimationFrame(frame);
		});
		const resized = new ResizeObserver(() => {
			measure();
			draw(performance.now());
		});

		measure();
		draw(performance.now());
		stage.classList.add("is-live");
		if (still) reveal();
		resized.observe(stage);
		if (textRef && textRef.current) resized.observe(textRef.current);
		if (!still) {
			seen.observe(stage);
			raf = requestAnimationFrame(frame);
		}

		return () => {
			cancelAnimationFrame(raf);
			seen.disconnect();
			resized.disconnect();
			stage.classList.remove("is-live");
		};
	}, [items, shapes, textRef, burstRef]);

	return (
		// Decorative: every project here is also in the list below.
		<div
			ref={stageRef}
			aria-hidden="true"
			className="orbit pointer-events-none absolute inset-0 z-0 select-none [--b:44px] sm:[--b:56px]"
		>
			{items.map((item, i) => {
				const shape = shapes ? shapes[i] : { src: item.project.iconUrl, aspect: 1 };
				return (
					<div
						key={item.project.title}
						ref={(el) => { itemRefs.current[i] = el; }}
						className="orbit-item absolute left-0 top-0"
						style={{ "--i": i, height: "var(--b)", width: `calc(var(--b) * ${shape.aspect})` }}
					>
						<img src={shape.src} alt="" draggable={false} className="h-full w-full object-contain" />
					</div>
				);
			})}
		</div>
	);
}
