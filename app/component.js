export default function() {
	const element = document.createElement('h1');

	// element.className = 'pure-button';
	element.innerHTML = 'Hello World';
	element.className = 'pure-button';

	const iconChild = document.createElement('i');
	iconChild.className = 'fa fa-hand-spock-o fa-lg';
	element.appendChild(iconChild);

	element.onclick = () => {
		require.ensure([], (require) => {
			element.textContent = require('./lazy').default;
		});
	};

	return element;
}
