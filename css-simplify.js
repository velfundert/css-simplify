#!/usr/bin/env node
var css = require('css'),
	fs = require('fs'),
	_ = require('underscore');

var cumulativeComparisonVectorFactoryFactory = function() {

	var dict = {},
			dictlength = 0;
	
	return function(rule) {
		var vector = Array.apply(null, Array(dictlength)).map(Number.prototype.valueOf, 0);

		_.each(rule.selectors, function(element){
			if (dict[element]) {
				vector[dict[element]] = 1;
			}else {
				dict[element] = dictlength++;
				vector.push(1);
			}
		});

		return vector;
	};
};

var safeCosineSimilarity = function(a, b) {
	var result = 0, denom = 0;
	for (var i = 0; i < a.length && i < b.length; ++i ) {
		result += a[i] * b[i];
	}
	var reducer = function(memo, value) { return memo + value * value; };
	return result / (1+ Math.sqrt( _.reduce(a, reducer, 0) * _.reduce(b, reducer, 0) ));
};

var rankVectors = function (vectors) {
	// how can we save time and computations when doing the comparisons? can we?
	// what are we really looking for, how do we find the most similar things?
	var ranks = [],
		length = vectors.length;
	
	for (var j = 0; j < length; ++j ) {
		ranks[j] = [];

		for (var i = 0; i < length; ++i) {
			if ( i === j ) {
				ranks[j][i] = 0;
				continue;
			}
			ranks[j][i] = safeCosineSimilarity(vectors[i], vectors[j]);
		}
	}

	return ranks;
};


var vecfac = cumulativeComparisonVectorFactoryFactory(),
	vectors = null;

// lets go:
fs.readFile('lol.css', 'utf8', function (err, res) {
	if (res !== null) {
		vectors = _.map(_.filter(css.parse(res).stylesheet.rules, function(x) { return x.type === 'rule';}), vecfac);
	} else {
		console.log('ERROR');
		console.log(err);
	}
	if (vectors === null) {
		console.log('vectors is null');
		process.exit();
	}
 
	var rankedVectors = rankVectors(vectors);
	console.log(rankedVectors);
});

