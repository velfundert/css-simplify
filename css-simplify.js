var css = require('css'),
		fs = require('fs'),
		_ = require('underscore');

var cumulativeComparisonVectorFactory = function() {

	var dict = {}
			dictlength = 0;
	

	return function (rule) {
		var vector = Array.apply(null, Array(dictlength)).map(Number.prototype.valueOf,0);

		console.log(dict.length);
		_.each(rule.selectors, function(element){


			if (dict[element]) {
				vector[dict[element]] = 1;
			}else {
				dict[element] = dictlength++;
				vector.push(1);
			}
		});

		// look up rules in dictionary, add the ones that doesn't exist.
		// ... while simultaneously building an array (the vector)
		// return that vector:
		console.log(vector);

		return vector;
	}
};

var vecfac = cumulativeComparisonVectorFactory();

function  parseit(err, res) {
	if (res != null) {
		_.each(_.filter(css.parse(res).stylesheet.rules, function(x) { return x.type === 'rule';}), vecfac);
	} else {
		console.log(err);
	}
}

fs.readFile('lol.css', 'utf8', parseit);


var safeCosineSimilarity = function(a, b) {
	var result = 0, denom = 0;
	for (var i = 0; i < a.length && i < b.length; ++i ) {
		result += a[i] * b[i];
	}
	var reducer = function(memo, value) { return memo + value*value; };
	return result / (1+ sqrt( _.reduce(a, reducer, 0) * _.reduce(b, reducer, 0) ));
};

var findSimilarRules = function () {
	// how can we save time and computations when doing the comparisons? can we?
	// what are we really looking for, how do we find the most similar things?

};
