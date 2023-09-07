import React from 'react';

const Question = ({ question }) => {
	return (
		<div>
			<h2 className="font-bold mb-2">Question</h2>
			<p className="mb-4">{question}</p>
		</div>
	);
};

export default Question;
