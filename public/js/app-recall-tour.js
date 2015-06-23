var tour = new Tour({
	steps: [
		{
			title: "Welcome",
			content: "Welcome to the cheesiest recall page.",
			orphan: true
		},
		{
			element: "#observe",
			title: "This is the search bar",
			content: "Text can be typed in or filters can be selected in the filter menu. Click the caret icon to expand the filter menu.",
			placement: "left",
			onShown: function (tour) {
				$(".popover.tour-tour .popover-navigation .btn-group .btn[data-role=next]").prop("disabled", true);
			},
			reflex: true,
			backdrop: true
		},
	]
});

tour.init();