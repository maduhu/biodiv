<%@page import="species.groups.SpeciesGroup"%>
<%@page import="species.groups.UserGroup"%>

<div id="filterPanel" class="span4 sidebar" style="margin-left:0px;margin-right:18px;">
    <div class="sidebar_section" style="clear:both;overflow:hidden;">
        <h5 style="position:relative"> ${g.message(code:'heading.modules')} 
            <span class="pull-right" style="position:absolute;top:0px;right:0px;"><button class="btn btn-link resetFilter">${g.message(code:'objectposttogroups.title.select')}</button></span>
        </h5>
        <g:each in="${objectTypes}" var="objectType">
        <label class="checkbox">
            <% boolean checked = false;
            if(activeFilters?.object_type == null) {
                checked = true
            } else if (activeFilters.object_type.contains(objectType.name)) {
                checked = true
                }%>
            <input class="searchFilter moduleFilter ${checked?'active':''} " type="checkbox" name="module" value="${objectType.name}"  ${checked?'checked':''}/>${modules[objectType.name].displayName} (${objectType.count})
        </label>
        </g:each>
    </div>

    <div class="sidebar_section" style="clear:both;overflow:hidden;">
        <h5 style="position:relative"> ${g.message(code:'button.user.groups')} 
            <span class="pull-right" style="position:absolute;top:0px;right:0px;"><button class="btn btn-link resetFilter">${g.message(code:'objectposttogroups.title.select')}</button></span>
        </h5>
        
        <label class="checkbox">
            <input class="searchFilter uGroupFilter  ${(activeFilters?.uGroup == null)?'active':''}" type="checkbox" name="uGroup" value="all" ${(activeFilters?.uGroup == null)?'checked':''} disabled/> ${g.message(code:'all')}  </label>


        <g:set var="uGroupFilters" value="${activeFilters?.uGroup?.split(' OR ')}"/>
        <g:each in="${uGroups}" var="uGroup">
        <label class="checkbox">
            <g:set var="userGroupInstance" value="${UserGroup.read(Long.parseLong(uGroup.name))}"/>
            <% checked = false;
            if((uGroupFilters?.contains(userGroupInstance.id.toString()))) {
                checked = true
            } %>
            <input class="searchFilter uGroupFilter ${checked?'active':''} " type="checkbox" name="uGroup" value="${userGroupInstance.id}"  ${checked?'checked':''}/ >${userGroupInstance.name} (${uGroup.count})
        </label>
        </g:each>
    </div>


</div>

