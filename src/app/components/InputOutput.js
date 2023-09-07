import React from 'react';

const InputOutput = ({ input, output }) => {
	return (
		<div>
			<h3 className="font-medium underline mb-2">Input:</h3>
			<pre className="mb-2">{input}</pre>
			<h3 className="font-medium underline mb-2">Output:</h3>
			<pre className="mb-4">{output}</pre>
		</div>
	);
};

export default InputOutput;
