import React, { useState, useLayoutEffect, useRef, useMemo } from 'react';

const VirtualizedList = () => {
	const items = Array.from({ length: 20_000 }, (_, index) => ({
		id: Math.random().toString(36).slice(2),
		text: `Item ${index + 1}`
	}));

	const itemHeight = 40;
	const containerHeight = 600;
	const overScan = 3;

	const [listItems, setlistItems] = useState(items);
	const [scrollTop, setScrollTop] = useState(0);

	const scrollElementRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		const scrollElement = scrollElementRef.current;
		if (!scrollElement) {
			return;
		}

		const handleScroll = () => {
			const scrollTop = scrollElement.scrollTop;

			setScrollTop(scrollTop);
		};

		handleScroll();

		scrollElement.addEventListener('scroll', handleScroll);

		return () => scrollElement.removeEventListener('scroll', handleScroll);
	}, []);

	console.log(scrollTop);

	const virtualItems = useMemo(() => {
		const rangeStart = scrollTop;
		const rangeEnd = scrollTop + containerHeight;

		let startIndex = Math.floor(rangeStart / itemHeight);
		let endIndex = Math.ceil(rangeEnd / itemHeight);

		startIndex = Math.max(0, startIndex - overScan);
		endIndex = Math.min(listItems.length - 1, endIndex + overScan);

		const virtualItems = [];

		for (let i = startIndex; i <= endIndex; i++) {
			virtualItems.push({
				index: i,
				offsetTop: i * itemHeight
			});
		}

		return virtualItems;
	}, [scrollTop, listItems.length]);

	const totalListHeight = itemHeight * listItems.length;

	// const debounce = (func, delay) => {
	// 	let timeoutId;
	// 	return function () {
	// 		clearTimeout(timeoutId);
	// 		timeoutId = setTimeout(() => {
	// 			func.apply(this, arguments);
	// 		}, delay);
	// 	};
	// };

	return (
		<>
			<div style={{ padding: '10px 12px' }}>
				<h1>List</h1>
				<div style={{ marginBottom: '12' }}>
					<button onClick={() => setlistItems((items) => items.slice().reverse())}>reverse</button>
				</div>
				<div
					ref={scrollElementRef}
					style={{
						height: containerHeight,
						overflow: 'auto',
						outline: '2px solid red',
						outlineOffset: '-2px',
						position: 'relative'
					}}
				>
					<div style={{ height: totalListHeight }}>
						{virtualItems.map((virtualItem) => {
							const item = listItems[virtualItem.index];

							return (
								<div
									key={item.id}
									style={{
										position: 'absolute',
										top: '0',
										transform: `translateY(${virtualItem.offsetTop}px)`,
										height: itemHeight,
										padding: '6px 12px',
										outline: '2px solid teal',
										outlineOffset: '-2px'
									}}
								>
									<p>
										{item.id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										{item.text}
									</p>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</>
	);
};

export default VirtualizedList;
