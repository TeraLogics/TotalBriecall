'use strict';

var _ = require('underscore');

/**
 * State mappings.
 * @type {{AL: string[], AK: string[], AZ: string[], AR: string[], CA: string[], CO: string[], CT: string[], DE: string[], FL: string[], GA: string[], HI: string[], ID: string[], IL: string[], IN: string[], IA: string[], KS: string[], KY: string[], LA: string[], ME: string[], MD: string[], MA: string[], MI: string[], MN: string[], MS: string[], MO: string[], MT: string[], NE: string[], NV: string[], NH: string[], NJ: string[], NM: string[], NY: string[], NC: string[], ND: string[], OH: string[], OK: string[], OR: string[], PA: string[], RI: string[], SC: string[], SD: string[], TN: string[], TX: string[], UT: string[], VT: string[], VA: string[], WA: string[], WV: string[], WI: string[], WY: string[], DC: string[]}}
 */
exports.stateMappings = {
	AL: ['AL', 'Alabama'],
	AK: ['AK', 'Alaska'],
	AZ: ['AZ', 'Arizona'],
	AR: ['AR', 'Arkansas'],
	CA: ['CA', 'California'],
	CO: ['CO', 'Colorado'],
	CT: ['CT', 'Connecticut'],
	DE: ['DE', 'Delaware'],
	FL: ['FL', 'Florida'],
	GA: ['GA', 'Georgia'],
	HI: ['HI', 'Hawaii'],
	ID: ['ID', 'Idaho'],
	IL: ['IL', 'Illinois'],
	IN: ['IN', 'Indiana'],
	IA: ['IA', 'Iowa'],
	KS: ['KS', 'Kansas'],
	KY: ['KY', 'Kentucky'],
	LA: ['LA', 'Louisiana'],
	ME: ['ME', 'Maine'],
	MD: ['MD', 'Maryland'],
	MA: ['MA', 'Massachusetts'],
	MI: ['MI', 'Michigan'],
	MN: ['MN', 'Minnesota'],
	MS: ['MS', 'Mississippi'],
	MO: ['MO', 'Missouri'],
	MT: ['MT', 'Montana'],
	NE: ['NE', 'Nebraska'],
	NV: ['NV', 'Nevada'],
	NH: ['NH', 'New Hampshire'],
	NJ: ['NJ', 'New Jersey'],
	NM: ['NM', 'New Mexico'],
	NY: ['NY', 'New York'],
	NC: ['NC', 'North Carolina'],
	ND: ['ND', 'North Dakota'],
	OH: ['OH', 'Ohio'],
	OK: ['OK', 'Oklahoma'],
	OR: ['OR', 'Oregon'],
	PA: ['PA', 'Pennsylvania'],
	RI: ['RI', 'Rhode Island'],
	SC: ['SC', 'South Carolina'],
	SD: ['SD', 'South Dakota'],
	TN: ['TN', 'Tennessee'],
	TX: ['TX', 'Texas'],
	UT: ['UT', 'Utah'],
	VT: ['VT', 'Vermont'],
	VA: ['VA', 'Virginia'],
	WA: ['WA', 'Washington'],
	WV: ['WV', 'West Virginia'],
	WI: ['WI', 'Wisconsin'],
	WY: ['WY', 'Wyoming'],
	DC: ['DC', 'District of Columbia', 'D.C.']
};

/**
 * Key work mappings.
 * @type {{dairy: string[], dye: string[], egg: string[], fruit: string[], fish: string[], gluten: string[], meat: string[], nut: string[], soy: string[], spice: string[], supplement: string[], vegetable: string[]}}
 */
exports.keywordMappings = {
	'dairy': ['dairy', 'butter', 'cheddar', 'cheese', 'chocolate', 'cream', 'milk', 'whey'],
	'dye': ['dye', 'color', 'red', 'yellow', 'pink', 'blue', 'green'],
	'egg': ['egg'],
	'fish': ['fish', 'shellfish', 'oyster', 'tuna', 'salmon', 'shrimp', 'herring', 'clam', 'lobster', 'seafood'],
	'fruit': ['fruit', 'corn', 'raspberry', 'pineapple', 'pear', 'peach', 'apple', 'plum', 'lemon', 'strawberry', 'mango', 'cranberry', 'orange', 'cherry', 'salsa', 'melon', 'tomato', 'raisin', 'olive', 'grape', 'pumpkin', 'pomegranate'],
	'gluten': ['gluten', 'wheat', 'bread', 'pasta', 'flour', 'rice', 'bagel', 'cake', 'cookie', 'brownie', 'taco', 'pizza'],
	'meat': ['meat', 'chicken', 'steak', 'beef', 'sausage', 'pork', 'ham', 'turkey', 'bacon'],
	'nut': ['nut', 'peanut', 'seed', 'walnut', 'almond', 'pistachio', 'hazelnut', 'pecan'],
	'soy': ['soy', 'tofu'],
	'spice': ['spice', 'vanilla', 'peppermint', 'garlic', 'ginseng', 'ginger', 'herb', 'seasoning', 'cumin', 'cinnamon', 'salt', 'coriander', 'honey'],
	'supplement': ['supplement', 'coffee'],
	'vegetable': ['vegetable', 'salad', 'spinach', 'lettuce', 'sprout', 'mushroom', 'onion', 'potato', 'romaine', 'broccoli', 'celery', 'cucumber', 'pea', 'cabbage', 'chili', 'jalapeno', 'pepper', 'bean']
};

/**
 * Status keys.
 * @type {string[]}
 */
exports.statusKeys = ['ongoing', 'completed', 'terminated', 'pending'];

/**
 * Supported count fields.
 */
exports.supportedCountFields = ['classification'];

/**
 * Validates state.
 * @param {String} state The state.
 * @returns {Boolean} Whether or not it was valid.
 */
exports.isValidState = function (state) {
	return _.isString(state) && exports.stateMappings.hasOwnProperty(state.toUpperCase());
};

/**
 * Validates keywords.
 * @param {String[]} keywords A list of keywords
 * @returns {String|undefined} Returns null if not an array or the first invalid element or undefined if all are valid
 */
exports.areValidKeywords = function (keywords) {
	return !_.isArray(keywords) ? null : _.find(keywords, function (keyword) {
		return _.isString(keyword) && !exports.keywordMappings.hasOwnProperty(keyword.toLowerCase());
	});
};

/**
 * Validates status string.
 * @param {String} status The status string.
 * @returns {Boolean} Whether or not it was valid.
 */
exports.isValidStatus = function (status) {
	return _.isString(status) && _.contains(exports.statusKeys, status.toLowerCase());
};

/**
 * Validates count field string.
 * @param {String} field The field string.
 * @returns {Boolean} Whether or not it was valid.
 */
exports.isValidCountField = function (field) {
	return _.isString(field) && _.contains(exports.supportedCountFields, field.toLowerCase());
};
