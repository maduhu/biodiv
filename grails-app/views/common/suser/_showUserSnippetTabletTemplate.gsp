
<div class="snippet grid_4 tablet" style="width: 200px; padding: 0;">
	<g:set var="mainImage" value="${userInstance.icon()}" />
	<div class="figure"
		style="float: left; max-height: 220px; max-width: 200px">

		<g:link action="show" controller="SUser" id="${userInstance.id}">
			<img src="${userInstance.icon()}" class="normal_profile_pic"
				title="${userInstance.username}" />
		</g:link>
	</div>
	
	<div class="grid_4 all_content" style="width:200px; padding:0; margin:0;">
		<sUser:showUserStoryTablet model="['userInstance':userInstance]"></sUser:showUserStoryTablet>
	</div>
	
</div>
