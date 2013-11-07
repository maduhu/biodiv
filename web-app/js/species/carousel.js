var itemLoadCallback = function(carousel, state) {
        carousel.last = carousel.last?carousel.last:3;
	var params = {
		"limit" :carousel.last - carousel.first, //carousel.options.scroll,
		"offset" :carousel.first,
		"filterProperty": carousel.options.filterProperty,
		"filterPropertyValue": carousel.options.filterPropertyValue,
		"contextGroupWebaddress":carousel.options.contextGroupWebaddress
	}
	if (state == 'prev'){
		return;
	}
	params.offset = carousel.first - 1;
	if(carousel.last == carousel.options.size){
		params.limit = carousel.last;
	}
	var jqxhr = $.get(carousel.options.url, params, function(data) {
		itemAddCallback(carousel, carousel.first, carousel.last, data, state);
	});
}

var itemAddCallback = function(carousel, first, last, data, state) {
	var items = data["observations"];
	for (i = 0; i < items.length; i++) {
		var actualIndex = first + i;
		if (!carousel.has(actualIndex)) {
			var item = carousel.add(actualIndex, carousel.options.getItemHTML(carousel, items[i]));
			resizeImage(item);
                        loadFeatureDetails(item);
		}
	}
	if(state == 'init') {
		if(data["count"] == 0) {
			$(carousel.options.carouselDivId).hide();
			if(carousel.options.filterProperty == 'user'){
				$(carousel.options.carouselAddObvDivId).show();
			}else{ 
				$(carousel.options.carouselMsgDivId).show();
			}
		} else {
			carousel.size(data["count"]);
		}
	}	
	if($(".jcarousel-item-horizontal").closest('.speciesField').length > 0)
		$(".jcarousel-item-horizontal").css('width', '210px');
	else
		$(".jcarousel-item-horizontal").css('width', '75px');
	$(".jcarousel-item  .thumbnail .ellipsis.multiline").trunk8({
		lines:3,		
	});

        //loadFeatureDetails(item);
}

function resizeImage(item) {
    var ele = item.find('img');
    var maxHeight=0,maxWidth=0;
    if(item.closest('.speciesField').length > 0) {
    	maxWidth='210px'
    	maxHeight='250px'
    } else {
    	maxWidth=item.hasClass('.jcarousel-item-horizontal') ? '75px' : '100%';
        maxHeight=item.hasClass('.jcarousel-item-horizontal') ? '75px':window.params.carousel.maxHeight;	
    }
    
    var width = ele.width();    // Current image width
    var height = ele.height();  // Current image height
    if(height > maxHeight){
        item.css('height', maxHeight);
    } 

    if(width == 0) {
        width = maxWidth;
    }

    if(width > maxWidth) {
        ele.css('position','absolute').css('left',(0-(Math.abs(maxWidth-width)/2)));
    }
    item.css('width', Math.min(maxWidth, width)).css('overflow', 'hidden');
}

var reloadCarousel = function(carousel, fitlerProperty, filterPropertyValue){
	carousel.options.filterProperty = fitlerProperty;
	carousel.options.filterPropertyValue = filterPropertyValue;
	var visibleOffset = carousel.last - carousel.first;
	carousel.reset();
	carousel.first = 1;
	carousel.last = carousel.first + visibleOffset;
	itemLoadCallback(carousel, 'init');
}

var itemAfterLoadCallback = function(carousel, state) {
	$(".jcarousel-item  .thumbnail .ellipsis.multiline").trunk8({
		lines:3,		
	});
}

var initCallback = function(carousel, status) {
    $(".jcarousel-prev-vertical").append("<i class='icon-chevron-up'></i>").hover(function(){
        $(this).children().addClass('icon-black');    
    }, function(){
        $(this).children().removeClass('icon-black');    
    });

    $(".jcarousel-next-vertical").append("<i class='icon-chevron-down'></i>").hover(function(){
        $(this).children().addClass('icon-black');    
    }, function(){
        $(this).children().removeClass('icon-black');    
    });

   
}

var setupCallback = function(carousel) {
}

var getSnippetHTML = function(carousel, item) {
	var paramsString = "";
	if(carousel.options.filterProperty === "speciesName"){
		paramsString = "?" + encodeURIComponent("species=" + carousel.options.filterPropertyValue);	
	}
	var imageTag = '<img class=img-polaroid src="' + item.imageLink + paramsString  + '" title="' + item.title  +'" alt="" />';

	var summary = item.summary?item.summary:''
        //TODO:split this into separate methods so that figure badge story parts can be build independently
	var eleHTML = '<div class=thumbnail>'+
                '<div class="'+item.type.replace(' ','_')+'_th snippet'+'">'+
                    '<span class="badge featured"> </span>'+
                    '<div class="figure pull-left observation_story_image">'+
                            '<a href='+ item.url + paramsString + '>' + imageTag + '</a>'+
                    '</div>'+
                    '<div class="'+'observation_story'+'">'+
                        '<div class="observation-icons">'

        eleHTML +=       (item.habitat)?
                                '<span style="float:right;" class="habitat_icon group_icon habitats_sprites active '+item.habitat.toLowerCase()+'_gall_th" title="'+item.habitat+'"></span>':''
        eleHTML +=       (item.sGroup)?
                                '<span style="float:right;" class="group_icon species_groups_sprites active '+item.sGroup.toLowerCase()+'_gall_th" title="'+item.sGroup+'"></span>':''

        eleHTML +=              '<span class="featured_details btn" style="display:none;"><i class="icon-list"></i></span>'

        eleHTML +=       '</div>'
        eleHTML +=      '<div class="featured_body">' +
                            '<div class="featured_title ellipsis">'

        eleHTML +=              '<div class="heading">'+
                                    '<a href='+ item.url + paramsString + '><span class="ellipsis">'+item.title + '</span></a>'+
                                '</div>'+
                            '</div>'
        for(var i=0; i<item.featuredNotes.length;i++) {
        var featuredNotesItem = item.featuredNotes[i]; 
        eleHTML +=          '<div class="featured_notes linktext">'
                            + featuredNotesItem.notes
                            + '<p style="margin:0px"><small>'+item.summary+'</small> <small>Featured on <b>'+$.datepicker.formatDate('MM dd, yy',new Date(featuredNotesItem.createdOn))+'</b>'

        if(featuredNotesItem.userGroupUrl) {
        eleHTML +=          ' in the group <b><a href="'+featuredNotesItem.userGroupUrl+'">'+featuredNotesItem.userGroupName+'</a></b>'
        }

        eleHTML +=           '</small></p>'

                            +'</div>'
        }
                        + '</div>'

/*        eleHTML +=      '<div class="observation_story_body toggle_story" style="display:none;">' +
                            '<div class="prop">'+
                                '<i class="pull-left icon-share-alt"></i>'+
                                '<div class="value">'+
                                    '<div class="species_title">'+
                                            item.title +
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>'+*/
          eleHTML +='</div>'+
            '</div>'+
        '</div>'
        return eleHTML;
};

var getSnippetTabletHTML = function(carousel, item) {
	var paramsString = "";
	if(carousel.options.filterProperty === "speciesName"){
		paramsString = "?" + encodeURIComponent("species=" + carousel.options.filterPropertyValue);	
	}
	var imageTag = '<img class=img-polaroid src="' + item.imageLink + paramsString  + '" title="' + item.title  +'" alt="" />';

	var notes = item.notes?item.notes:''
	var summary = item.summary?item.summary:''
	return '<div class=thumbnail><div class="'+item.type.replace(' ','_')+'_th snippet tablet'+'"><div class=figure><a href='+ item.url + paramsString + '>' + imageTag + '</a></div><div class="'+'ellipsis multiline caption'+'">'+notes+'</div><div class="'+'ellipsis multiline caption'+'">'+summary+'</div></div></div>';

}

function loadFeatureDetails($ele) {
    if(!$ele) return;
    $ele.on('click', '.featured_details',
            function() {
                $(this).parent().next().next().slideToggle('slow').find('.ellipsis').trunk8({
                    lines:2
                }).linkify()
            });
}


