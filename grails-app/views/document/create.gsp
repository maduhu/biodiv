

<%@ page import="content.eml.Document"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="layout" content="main" />
<g:set var="entityName"
	value="${message(code: 'document.label', default: 'Document')}" />
<title><g:message code="default.create.label"
		args="[entityName]" /></title>
<script src="http://maps.google.com/maps/api/js?sensor=true"></script>

<r:require modules="add_file" />
<uploader:head />

<style>
.control-group.error  .help-inline {
	padding-top: 15px
}

input.dms_field {
	width: 19%;
	display: none;
}

.sidebar-section {
	width: 450px;
	margin: 0px 0px 20px -10px;
	float: right;
}
</style>
</head>
<body>
	<div class="nav">
		<span class="menuButton"><a class="home"
			href="${createLink(uri: '/')}"><g:message
					code="default.home.label" /></a></span> <span class="menuButton"><g:link
				class="list" action="list">
				<g:message code="default.list.label" args="[entityName]" />
			</g:link></span>
	</div>
	<div class="body">
		<h1>
			<g:message code="default.create.label" args="[entityName]" />
		</h1>
		<g:if test="${flash.message}">
			<div class="message">
				${flash.message}
			</div>
		</g:if>
		<g:hasErrors bean="${documentInstance}">
			<div class="errors">
				<g:renderErrors bean="${documentInstance}" as="list" />
			</div>
		</g:hasErrors>

		<% 
				def form_action = uGroup.createLink(action:'save', controller:'document', 'userGroup':userGroupInstance, 'userGroupWebaddress':params.webaddress)
			
			%>

		<form id="documentForm" action="${form_action}" method="POST"
			class="form-horizontal">

			<div class="span12 super-section">
				<div class="section">

					<div
						class="control-group ${hasErrors(bean: documentInstance, field: 'type', 'error')}">
						<label class="control-label" for="type"><g:message
								code="document.type.label" default="Document Type" /><span
							class="req">*</span></label>
						<div class="controls">
							<g:select name="type"
								from="${content.eml.Document$DocumentType?.values()}"
								keys="${content.eml.Document$DocumentType?.values()*.name()}"
								value="${documentInstance?.type?.name()}" />

						</div>

					</div>
					<div
						class="control-group ${hasErrors(bean: documentInstance, field: 'title', 'error')}">
						<label class="control-label" for="title"><g:message
								code="document.title.label" default="Document Title" /><span
							class="req">*</span></label>
						<div class="controls">

							<input type="text" class="input-xxlarge" name="title"
								value="${documentInstance?.title}" required />
						</div>

					</div>


				</div>
			</div>
			<g:render template="/UFile/uFile"
				model="['uFileInstance':documentInstance?.uFile, 'parent':documentInstance]"></g:render>
			<g:render template="coverage"
				model="['coverageInstance':documentInstance?.coverage]"></g:render>



			<uGroup:isUserGroupMember>
				<div class="span12 super-section" style="clear: both">
					<div class="section" style="position: relative; overflow: visible;">
						<h3>Post to User Groups</h3>
						<div>
							<%
									def docActionMarkerClass = (params.action == 'create' || params.action == 'save')? 'create' : '' 
								%>
							<div id="userGroups" class="${docActionMarkerClass}"
								name="userGroups" style="list-style: none; clear: both;">
								<uGroup:getCurrentUserUserGroups
									model="['documentInstance':documentInstance]" />
							</div>
						</div>
					</div>
				</div>
			</uGroup:isUserGroupMember>



			<div class="span12" style="margin-top: 20px; margin-bottom: 40px;">

				<g:if test="${documentInstance?.id}">
					<a
						href="${uGroup.createLink(controller:'document', action:'show', id:documentInstance.id)}"
						class="btn" style="float: right; margin-right: 30px;"> Cancel
					</a>
				</g:if>
				<g:else>
					<a
						href="${uGroup.createLink(controller:'UFile', action:'browser')}"
						class="btn" style="float: right; margin-right: 30px;"> Cancel
					</a>
				</g:else>

				<g:if test="${documentInstance?.id}">
					<div class="btn btn-danger"
						style="float: right; margin-right: 5px;">
						<a
							href="${uGroup.createLink(controller:'document', action:'flagDeleted', id:documentInstance.id)}"
							onclick="return confirm('${message(code: 'default.document.delete.confirm.message', default: 'This document will be deleted. Are you sure ?')}');">Delete
							Document </a>
					</div>
				</g:if>
				<button id="documentFormSubmit" type="submit"
					class="btn btn-primary" style="float: right; margin-right: 30px;">Save</button>
			</div>

		</form>
	</div>

	<r:script>
	
	$(document).ready(function() {
		$('#use_dms').click(function(){
            if ($('#use_dms').is(':checked')) {
                $('.dms_field').fadeIn();
                $('.degree_field').hide();
            } else {
                $('.dms_field').hide();
                $('.degree_field').fadeIn();
            }
    });
    
    			$("#documentFormSubmit").click(function(){
				var speciesGroups = getSelectedGroup();
		        var habitats = getSelectedHabitat();
		        
		       	$.each(speciesGroups, function(index){
		       		var input = $("<input>").attr("type", "hidden").attr("name", "speciesGroup."+index).val(this);
					$('#documentForm').append($(input));	
		       	})
		        
		       	$.each(habitats, function(index){
		       		var input = $("<input>").attr("type", "hidden").attr("name", "habitat."+index).val(this);
					$('#documentForm').append($(input));	
		       	})
		       	
		        $("#documentForm").submit();
		        return false;
			});
			
						function getSelectedGroup() {
			    var grp = []; 
			    $('#speciesGroupFilter button').each (function() {
			            if($(this).hasClass('active')) {
			                    grp.push($(this).attr('value'));
			            }
			    });
			    return grp;	
			} 
			    
			function getSelectedHabitat() {
			    var hbt = []; 
			    $('#habitatFilter button').each (function() {
			            if($(this).hasClass('active')) {
			                    hbt.push($(this).attr('value'));
			            }
			    });
			    return hbt;	
			}
			<%
				documentInstance?.coverage?.speciesGroups.each {
					out << "jQuery('#group_${it.id}').addClass('active');";
				}
				documentInstance?.coverage?.habitats.each {
					out << "jQuery('#habitat_${it.id}').addClass('active');";
				}
			%>
			
						});
    
        </r:script>
</body>
</html>