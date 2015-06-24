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
 * @type {{dairy: string[], dye: string[], egg: string[], fish: string[], gluten: string[], nut: string[], soy: string[]}}
 */
exports.keywordMappings = {
	dairy: ['dairy', 'milk', 'cheese', 'cheeses', 'whey'],
	dye: ['dye', 'color', 'colors', 'red', 'yellow', 'pink', 'blue', 'green'],
	egg: ['egg', 'eggs'],
	fish: ['fish', 'shellfish', 'oyster', 'oysters'],
	gluten: ['gluten', 'wheat'],
	nut: ['nut', 'nuts', 'peanut', 'peanuts', 'seed', 'seeds', 'walnut', 'walnuts', 'almond', 'almonds', 'pistachio', 'pistachios', 'hazelnut', 'hazelnuts'],
	soy: ['soy', 'tofu']
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
	return exports.stateMappings.hasOwnProperty(state.toUpperCase());
};

/**
 * Validates keywords.
 * @param {String[]} keywords A list of keywords
 * @returns {String|undefined} Returns first invalid element or undefined if all are valid
 */
exports.areValidKeywords = function (keywords) {
	return _.find(keywords, function (keyword) {
		return !exports.keywordMappings.hasOwnProperty(keyword.toLowerCase());
	});
};

/**
 * Validates status string.
 * @param {String} status The status string.
 * @returns {Boolean} Whether or not it was valid.
 */
exports.isValidStatus = function (status) {
	return _.contains(exports.statusKeys, status.toLowerCase());
};

/**
 * Validates count field string.
 * @param {String} field The field string.
 * @returns {Boolean} Whether or not it was valid.
 */
exports.isValidCountField = function (field) {
	return _.contains(exports.supportedCountFields, field.toLowerCase());
};