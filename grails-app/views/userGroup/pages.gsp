
<%@page import="org.springframework.security.acls.domain.BasePermission"%>

<%@page import="org.springframework.security.acls.domain.BasePermission"%>
<%@page import="species.utils.ImageType"%>
<%@page import="species.utils.Utils"%>
<%@ page import="species.groups.UserGroup"%>
<html>
<head>
<meta name="layout" content="main" />
<g:set var="entityName" value="${userGroupInstance.name}" />
<title><g:message code="default.show.label"
		args="[userGroupInstance.name]" /></title>
<r:require modules="userGroups_show" />
</head>
<body>

	<div class="observation span12">
		<uGroup:showSubmenuTemplate model="['entityName':'Pages']"/>
		<uGroup:rightSidebar model="['userGroupInstance':userGroupInstance]"/>
		<div class="userGroup-section center_panel">
			
				<div class="btn-group pull-right" style="z-index: 10;margin-bottom:10px;">
					<sec:permitted className='species.groups.UserGroup'
						id='${userGroupInstance.id}'
						permission='${org.springframework.security.acls.domain.BasePermission.ADMINISTRATION}'>

						<g:link action="pageCreate" id="${userGroupInstance.id}"
							class="btn btn-large btn-info">
							<i class="icon-plus"></i>Add a Newsletter</g:link>
					</sec:permitted>
				</div>
			
			<div class="list" style="margin: 30px 0px;">
				<table class="table table-striped">
					<thead>
						<tr>

							<g:sortableColumn property="title"
								title="${message(code: 'newsletter.title.label', default: 'Title')}" />

							<g:sortableColumn property="date"
								title="${message(code: 'newsletter.date.label', default: 'Date')}" />


						</tr>
					</thead>
					<tbody>
						<g:each in="${userGroupInstance.newsletters}"
							var="newsletterInstance" status="i">
							<tr class="${(i % 2) == 0 ? 'odd' : 'even'}">

								<td><a
									href="${createLink(mapping:'userGroupPageShow', params:['id':userGroupInstance.id, 'newsletterId':newsletterInstance.id]) }">
										${fieldValue(bean: newsletterInstance, field: "title")} </a>
								</td>
								<td><g:formatDate date="${newsletterInstance.date}"
										type="date" style="MEDIUM" />
								</td>
							</tr>
						</g:each>
					</tbody>
				</table>
			</div>
		</div>
	</div>
	
	
	<r:script>
		$(document).ready(function(){

		});
	</r:script>
</body>
</html>