define(['jquery', 'Tour'], function ($, Tour, require) {
	var recallTour = new Tour({
		//storage: false,
		steps: [
			{
				title: "Getting Started",
				content: "Welcome to the cheesiest recall page. We'll give you a tour of the site.",
				orphan: true,
				backdrop: true
			},
			{
				element: "#header-map",
				title: "Location",
				content: "We'll only show you recalls affecting your state.",
				placement: "bottom",
				backdrop: true
			},
			{
				element: "div .recall-summary-card:first",
				title: "Recalls",
				content: "Each card shows an on-going recall in your area. Watch out!",
				placement: "top",
				backdrop: true
			},
			{
				element: "div .recall-summary-card:first .panel-heading .panel-title:first",
				title: "Product",
				content: "This describes the product being recalled",
				placement: "top"
			},
			{
				element: "div .recall-summary-card:first .panel-heading .panel-subtitle:first",
				title: "Company",
				content: "This describes the company recalling the product",
				placement: "bottom"
			},
			{
				element: "div .recall-summary-card:first .panel-body",
				title: "Description",
				content: "Why the product is being recalled",
				placement: "top"
			},
			{
				element: "div .recall-summary-card:first .panel-footer ul .glyphicon-share-alt",
				title: "Share",
				content: "Share this recall with someone via Facebook, E-mail or get a link",
				placement: "bottom",
				onShown: function () {
					$("div .recall-summary-card:first .panel-footer ul .glyphicon-share-alt").parent().dropdown('toggle');
				},
				onHidden: function () {
					$("div .recall-summary-card:first .panel-footer ul .open").removeClass('open');
				}
			},
			{
				element: "div .recall-summary-card:first .panel-footer ul .glyphicon-pushpin",
				title: "#Pinning",
				content: "You can pin recalls to find them again easily",
				placement: "top"
			},
			{
				element: "div .recall-summary-card:first .recall-card-toggle",
				title: "Hide Recalls",
				content: "If you don't want to see a recall again, you can hide it from view",
				placement: "left"
			},
			{
				element: "div .recall-summary-card:first .glyphicon-info-sign",
				title: "Get More Info",
				content: "Click the info button for more info about a recall, such as the states affected and other people's comments",
				placement: "top"
			},
			{
				title: "The End",
				content: "You're now a recall master.  Remember with great power comes great responsibility, share your recall knowledge with others!",
				orphan: true,
				backdrop: true
			}
		]
	});

	return {
		start: function () {
			recallTour.init();
			recallTour.start();
		}
	}
});