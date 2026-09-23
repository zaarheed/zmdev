import { useEffect, useRef } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";

// A two-way toggle whose selector behaves like a sticky water droplet. The
// leading edge darts to the new option, the trailing edge clings for a beat,
// then lets go and wobbles into place. It thins as it stretches and bulges a
// little as it settles.
//
// The droplet's edges are percentages of the track, so the server render is
// already in the right place and nothing needs measuring.
//
// The labels are drawn twice over the real buttons, as decoration: a dark copy
// clipped to everything outside the droplet, and a light copy clipped to the
// droplet itself. The text changes colour exactly where the droplet covers it,
// even halfway through a stretch.

const LEAD = { type: "spring", stiffness: 600, damping: 38 };
const TRAIL = { type: "spring", stiffness: 300, damping: 19, delay: 0.08 };

const CELL = "px-4 sm:px-5 py-2 inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-semibold text-sm sm:text-base";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

function Label({ option, countClassName = "", srCount = false }) {
	return (
		<>
			<span>{option.label}</span>
			{typeof option.count === "number" && (
				<span className={`text-xs font-medium tabular-nums ${countClassName}`}>
					{option.count}
					{srCount && <span className="sr-only"> projects</span>}
				</span>
			)}
		</>
	);
}

export default function DropletToggle({ options, value, onChange, label, controls }) {
	const index = Math.max(0, options.findIndex((option) => option.id === value));
	const size = 100 / options.length;
	const columns = `repeat(${options.length}, minmax(0, 1fr))`;

	const left = useMotionValue(index * size);
	const right = useMotionValue(index * size + size);
	const reduce = useReducedMotion();
	const buttons = useRef([]);

	const leftPct = useTransform(left, (l) => `${clamp(l, 0, 100)}%`);
	const rightPct = useTransform(right, (r) => `${100 - clamp(r, 0, 100)}%`);

	// Thinner while stretched, slightly fuller while it settles.
	const scaleY = useTransform([left, right], ([l, r]) => clamp(1 - 0.2 * ((r - l) / size - 1), 0.8, 1.08));

	const inside = useTransform([left, right], ([l, r]) =>
		`inset(0% ${100 - clamp(r, 0, 100)}% 0% ${clamp(l, 0, 100)}% round 9999px)`
	);
	const outside = useTransform([left, right], ([l, r]) => {
		const from = clamp(l, 0, 100);
		const to = clamp(r, 0, 100);
		return `polygon(0% 0%, ${from}% 0%, ${from}% 100%, ${to}% 100%, ${to}% 0%, 100% 0%, 100% 100%, 0% 100%)`;
	});

	// Declared after the transforms on purpose. React runs every effect cleanup
	// before any new effect, so the transforms must re-subscribe to left/right
	// before this effect moves them, or an instant (reduced motion) move is lost.
	useEffect(() => {
		const toLeft = index * size;
		const toRight = toLeft + size;

		if (left.get() === toLeft && right.get() === toRight) return undefined;

		if (reduce) {
			left.set(toLeft);
			right.set(toRight);
			return undefined;
		}

		const movingRight = toLeft > left.get();
		const lead = movingRight ? animate(right, toRight, LEAD) : animate(left, toLeft, LEAD);
		const trail = movingRight ? animate(left, toLeft, TRAIL) : animate(right, toRight, TRAIL);

		return () => {
			lead.stop();
			trail.stop();
		};
	}, [index, size, reduce, left, right]);

	const onKeyDown = (event) => {
		const last = options.length - 1;
		const next = {
			ArrowRight: index === last ? 0 : index + 1,
			ArrowLeft: index === 0 ? last : index - 1,
			Home: 0,
			End: last,
		}[event.key];

		if (next === undefined) return;
		event.preventDefault();
		onChange(options[next].id);
		buttons.current[next]?.focus();
	};

	return (
		<div
			role="tablist"
			aria-label={label}
			onKeyDown={onKeyDown}
			className={`
				relative inline-grid rounded-full p-1 font-plex
				bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700
				shadow-[0_10px_30px_-12px_rgba(24,24,27,0.35)]
			`}
			style={{ gridTemplateColumns: columns }}
		>
			{options.map((option, i) => {
				const selected = i === index;
				return (
					<button
						key={option.id}
						ref={(element) => { buttons.current[i] = element; }}
						type="button"
						role="tab"
						id={`tab-${option.id}`}
						aria-selected={selected}
						aria-controls={controls}
						tabIndex={selected ? 0 : -1}
						onClick={() => onChange(option.id)}
						className={`
							${CELL} relative rounded-full text-transparent select-none cursor-pointer
							transition-colors duration-200
							[@media(hover:hover)]:hover:bg-zinc-100 dark:[@media(hover:hover)]:hover:bg-zinc-700
							focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
							focus-visible:ring-azure-500 dark:focus-visible:ring-mango-500
							ring-offset-white dark:ring-offset-zinc-800
						`}
					>
						<Label option={option} srCount />
					</button>
				);
			})}

			<div aria-hidden="true" className="pointer-events-none absolute inset-1">
				<motion.div
					className={`
						absolute inset-y-0 rounded-full bg-azure-600 dark:bg-mango-500
						shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-3px_6px_rgba(0,0,0,0.15),0_6px_14px_-6px_rgba(0,99,204,0.7)]
						dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),inset_0_-3px_6px_rgba(0,0,0,0.12),0_6px_14px_-6px_rgba(250,205,81,0.5)]
					`}
					style={{ left: leftPct, right: rightPct, scaleY }}
				/>
			</div>

			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-1 grid text-zinc-700 dark:text-zinc-300"
				style={{ gridTemplateColumns: columns, clipPath: outside }}
			>
				{options.map((option) => (
					<span key={option.id} className={CELL}>
						<Label option={option} countClassName="text-zinc-500 dark:text-zinc-400" />
					</span>
				))}
			</motion.div>

			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-1 grid text-white dark:text-zinc-900"
				style={{ gridTemplateColumns: columns, clipPath: inside }}
			>
				{options.map((option) => (
					<span key={option.id} className={CELL}>
						<Label option={option} />
					</span>
				))}
			</motion.div>
		</div>
	);
}
